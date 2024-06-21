import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, combineLatest, Observable, startWith  } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { UntypedFormControl } from '@angular/forms';

import { allHazards, Chemical, Expiry } from '../coshh/types';
import { checkDuplicates, handleError } from '../utility/utilities';
import { DataService } from './data.service';
import { environment } from 'src/environments/environment';
import { ExpiryService } from './expiry.service';
import { HazardService } from './hazard.service';


@Injectable({
    providedIn: 'root'
})
/**
 * Service which acts as the single source of truth for chemicals.  On initialisation the service gets a list of all chemicals
 * from the API and sets these in state.  This list of chemicals is then filtered when filter controls are applied by a user,
 * and the filtered list is then set in state.  The filtered list is used by the coshh component to display the relevant
 * chemicals in the table.
 */
export class ChemicalService {

    private readonly allChemicals$: BehaviorSubject<Chemical[]> = new BehaviorSubject<Chemical[]>([]);
    readonly filteredChemicals$: BehaviorSubject<Chemical[]> = new BehaviorSubject<Chemical[]>([]);
    loggedInUser = '';

    // setup for the various filters and search boxes; the controls are used for filtering the chemicals displayed in the
    // table (filteredChemicals$) and the values are used for the options in the search boxes when a user types
    cupboardFilterControl = new UntypedFormControl('All');
    cupboardFilterValues: string[] = [];

    expiryFilterControl = new UntypedFormControl('Any');
    expiryFilterValues = ['Any', '< 30 Days', 'Expired'];

    hazardFilterValues = (<string[]>allHazards()).concat('All');
    hazardFilterControl = new UntypedFormControl('All');

    labFilterControl = new UntypedFormControl('All');
    labFilterValues: string[] = [];

    nameOrNumberSearchOptions: Observable<string[]> = new Observable();
    nameOrNumberSearchControl = new UntypedFormControl('');

    ownerSearchOptions: Observable<string[]> = new Observable();
    ownerSearchControl = new UntypedFormControl('');

    toggleArchiveControl = new UntypedFormControl(false);

    constructor(private http: HttpClient,
                private authService: AuthService,
                private dataService: DataService,
                private hazardService: HazardService,
                private expiryService: ExpiryService) {

        // get the complete list of chemicals from the API, set the hazard list on each chemical and set the background
        // colour based on the expiry date
        this.dataService.getChemicals()
            .subscribe((response) => {
                const chemicals = response.map((chemical) => {
                    chemical.hazardList = this.hazardService.getHazardListForChemical(chemical);
                    chemical.backgroundColour = this.expiryService.getExpiryColour(chemical);

                    return chemical;
                });

                //set chemicals in state
                this.setAllChemicals(chemicals);
                // apply default filters
                const filteredChemicals = this.filterChemicals(
                    this.toggleArchiveControl.value,
                    this.cupboardFilterControl.value,
                    this.hazardFilterControl.value,
                    this.labFilterControl.value,
                    this.expiryFilterControl.value,
                    this.nameOrNumberSearchControl.value ?? '',
                    this.ownerSearchControl.value ?? ''
                );

                // set filtered chemicals in state
                this.setFilteredChemicals(filteredChemicals);
            });

        // get labs from the API and set the filter values in the subscription
        this.dataService.getLabs()
            .subscribe((labs) => {
                this.labFilterValues = labs.concat('All');
            });

        // get cupboards from the API and set the filter values in the subscription
        this.dataService.getCupboards()
            .subscribe((cupboards) => {
                this.cupboardFilterValues = cupboards.concat('All');
            });

        // set up subscription to Auth0 authService to check whether the user is logged in and get their email address if so
        this.authService.user$
            .subscribe((user) => {
                this.loggedInUser = user?.email ?? '';
            });

        // get the latest value of all the filters
        combineLatest([
            this.hazardFilterControl,
            this.cupboardFilterControl,
            this.labFilterControl,
            this.expiryFilterControl,
            this.toggleArchiveControl,
            this.ownerSearchControl,
            this.nameOrNumberSearchControl
        ]
            .map((control) => control.valueChanges.pipe(startWith(control.value))))
            .subscribe(() => {
                // filter the chemicals based on the latest values of the filters
                const filteredChemicals = this.filterChemicals(
                    this.toggleArchiveControl.value,
                    this.cupboardFilterControl.value,
                    this.hazardFilterControl.value,
                    this.labFilterControl.value,
                    this.expiryFilterControl.value,
                    this.nameOrNumberSearchControl.value ?? '',
                    this.ownerSearchControl.value ?? ''
                );

                // set updated filtered chemicals in state
                this.setFilteredChemicals(filteredChemicals);
                // refresh the list of options for the cupboards search box
                this.refreshCupboardsFilterList();
            });
    }


    /**
     * Returns the value of the allChemicals$ BehaviorSubject
     * @returns {Chemical[]}
     */
    getAllChemicals = (): Chemical[] => {

        return this.allChemicals$.getValue();
    };

    /**
     * Setter function for the allChemicals$ BehaviorSubject
     * @param {Chemical[]} chemicals
     */
    setAllChemicals = (chemicals: Chemical[]): void => {
        this.allChemicals$.next(chemicals);
    };


    /**
     * Returns the value of the filteredChemicals$ BehaviorSubject
     * @returns {Chemical[]}
     */
    getFilteredChemicals = (): Chemical[] => {

        return this.filteredChemicals$.getValue();
    };


    /**
     * Setter function for the filteredChemicals$ BehaviorSubject
     * @param {Chemical[]} chemicals
     */
    setFilteredChemicals = (chemicals: Chemical[]): void => {
        this.filteredChemicals$.next(chemicals);
    };


    /**
     * Update the archived status of a chemical in the database
     * @param {Chemical} chemical
     */
    archive = (chemical: Chemical): void => {

       chemical.isArchived = !chemical.isArchived;
       
       // update the chemical in the database  and then update the chemical in state
       this.updateChemical(chemical)
       .pipe(catchError((error: HttpErrorResponse) => {

            chemical.isArchived = !chemical.isArchived;

            return handleError(error);
       }))
       .subscribe({
            next: (chemical) => {
                this.update(chemical);
            }
        });
    };


    /**
     * Filter the chemicals in state
     * @param {boolean} includeArchived
     * @param {string} cupboard
     * @param {string} hazardCategory
     * @param {string} lab
     * @param {Expiry} expiry
     * @param {string} nameOrNumberSearchStr
     * @param {string} ownerSearchStr
     * @returns {Chemical[]}
     */
    filterChemicals = (includeArchived: boolean,
                       cupboard: string,
                       hazardCategory: string,
                       lab: string,
                       expiry: Expiry,
                       nameOrNumberSearchStr: string,
                       ownerSearchStr: string): Chemical[] => {

        const nameOrNumberSearchLower = nameOrNumberSearchStr.toLowerCase();

        const ownerSearchLower = ownerSearchStr.toLowerCase();

        return this.getAllChemicals()
            .filter((chemical) => includeArchived || !chemical.isArchived)
            .filter((chemical) => cupboard === 'All' || chemical.cupboard?.toLowerCase().trim() === cupboard) // Note that cupboard is now set to lower case
            .filter((chemical) => hazardCategory === 'All' ||
                chemical.hazards?.map((hazard) => hazard.toString()).includes(hazardCategory))
            .filter((chemical) => lab === 'All' || chemical.location === lab)
            .filter((chemical) => this.expiryService.filterExpiryDate(chemical, expiry))
            .filter((chemical) => chemical.name.toLowerCase().includes(nameOrNumberSearchLower) || chemical.chemicalNumber?.toLowerCase().includes(nameOrNumberSearchLower))
            // // only filter if ownerSearchStr is not empty - this handles null values which we want to filter out only
            // // if the user has entered a value in the owner filter
            .filter((chemical) => ownerSearchStr ? chemical.owner?.toLowerCase().includes(ownerSearchLower) : true)
            .sort((a, b) => {
                if (a.name < b.name) {

                    return -1;
                }
                if (a.name > b.name) {

                    return 1;
                }

                return 0;
            });
    };


    /**
     * Returns an observable of chemical names and numbers for the name/number search box
     * @returns {Observable<string[]>}
     */
    getNameOrNumberSearchObservable = (): Observable<string[]> => {

        return this.nameOrNumberSearchControl.valueChanges.pipe(
            map((search) => this.dataService.getNamesAndNumbers(
                this.getFilteredChemicals(),
                search)
            )
        );
    };


    /**
     * Returns an observable of owners for the owner search box
     * @returns {Observable<string[]>}
     */
    getOwnerSearchObservable = (): Observable<string[]> => {

        return this.ownerSearchControl.valueChanges.pipe(
            map((search) => this.dataService.getOwners(
                this.getFilteredChemicals(),
                search)
            )
        );
    };


    /**
     * Called when a new chemical is added.  Updates the database via an API call and updates the chemicals in state
     * @param {Chemical} chemical
     */
    onChemicalAdded = (chemical: Chemical): void => {
        chemical.cupboard = chemical.cupboard?.toLowerCase().trim();
        this.http.post<Chemical>(`${environment.backendUrl}/chemical`, chemical)
        .pipe(catchError((error: HttpErrorResponse) => handleError(error)))
        .subscribe({
                next: (addedChemical: Chemical) => {
                    addedChemical.hazardList = this.hazardService.getHazardListForChemical(addedChemical);
                    addedChemical.backgroundColour = this.expiryService.getExpiryColour(addedChemical);
                    this.setAllChemicals(this.getAllChemicals().concat(addedChemical));
    
                    const filteredChemicals = this.filterChemicals(
                        this.toggleArchiveControl.value,
                        this.cupboardFilterControl.value,
                        this.hazardFilterControl.value,
                        this.labFilterControl.value,
                        this.expiryFilterControl.value,
                        this.nameOrNumberSearchControl.value ?? '',
                        this.ownerSearchControl.value ?? ''
                    );
    
                    this.setFilteredChemicals(filteredChemicals);
                },
                error: (err: HttpErrorResponse) => {
                    // use console.error to notify the user of the error
                    console.error(`'Failed to insert ${chemical.name}:' due to`, err.message);
                }
            });

    };


    /**
     * Called when a chemical is edited. Updates the database via an API call and updates the chemicals in state
     * @param {Chemical} chemical
     */
    onChemicalEdited = (chemical: Chemical): void => {
            // Update the chemical properties
            chemical.hazardList = this.hazardService.getHazardListForChemical(chemical);
            chemical.backgroundColour = this.expiryService.getExpiryColour(chemical);

            // Perform the API call to update the chemical
            this.updateChemical(chemical)
            .pipe(catchError((error: HttpErrorResponse) => handleError(error)))
            .subscribe({
                next: (chemical) => {
                    // If the API call is successful, update the hazards and the chemical in the state
                    this.hazardService.updateHazards(chemical);
                    
                    this.update(chemical);
                },
                error: (error) => {
                    // Handle the error appropriately
                    console.error('Failed to update chemical:', error.message);
                }
            });         
    };


    /**
     * Show only cupboards for currently selected lab. If 'All' labs it will show cupboards currently used over all the chemicals.
     * 'All' is always an option for cupboards filter so append it to the list
     */
    refreshCupboardsFilterList = (): void => {
        if (this.labFilterControl.value == 'All') {
            this.dataService.getCupboards().subscribe((cupboards) => {
                const dedupedCupboards: string[] = checkDuplicates(cupboards);

                this.cupboardFilterValues = dedupedCupboards.concat('All');
            });
        } else {
            this.dataService.getCupboardsForLab(this.labFilterControl.value).subscribe((cupboards) => {
                const dedupedCupboards: string[] = checkDuplicates(cupboards);

                this.cupboardFilterValues = dedupedCupboards.concat('All');
            });
        }
    };

    
    /**
     * Updates a passed chemical in state and then re-filters the chemicals
     * @param {Chemical} chemical
     */
    update = (chemical: Chemical) => {
        // find the index of the chemical which has been updated in the array of all chemicals
        const chemicalIndex = this.getAllChemicals().findIndex((chem) => chem.id === chemical.id);

        // update that chemical in the array of all chemicals and then re-filter and set filtered chemicals
        const allUpdatedChemicals = this.getAllChemicals();

        allUpdatedChemicals[chemicalIndex] = chemical;
        this.setAllChemicals(allUpdatedChemicals);
        const filteredChemicals = this.filterChemicals(
            this.toggleArchiveControl.value,
            this.cupboardFilterControl.value,
            this.hazardFilterControl.value,
            this.labFilterControl.value,
            this.expiryFilterControl.value,
            this.nameOrNumberSearchControl.value ?? '',
            this.ownerSearchControl.value ?? ''
        );

        this.setFilteredChemicals(filteredChemicals);
    };


    /**
     * Updates a chemical in the database via an API call, adds the logged in user for the last updated by field and lower
     * case and remove trailing spaces from the cupboard name to improve data integrity.  Sets the background colour for
     * the newly added chemical in state based on the expiry date
     * @param {Chemical} chemical
     */
    updateChemical = (chemical: Chemical): Observable<Chemical> => {
        // Lower case and remove trailing spaces from the cupboard name to make filtering and data integrity better
        chemical.cupboard = chemical.cupboard?.toLowerCase().trim();
        chemical.lastUpdatedBy = this.loggedInUser;

        return this.http.put(`${environment.backendUrl}/chemical`, chemical) as Observable<Chemical>;

    };

}
