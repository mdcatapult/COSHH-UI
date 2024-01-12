import * as moment from 'moment';
import {AuthService} from '@auth0/auth0-angular';
import {BehaviorSubject, combineLatest, Observable, startWith} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {UntypedFormControl} from '@angular/forms';

import {Chemical, ExpiryColor, yellow, red, Expiry} from '../coshh/types';
import {environment} from 'src/environments/environment';
import {HazardService} from './hazard-service.service';


@Injectable({
    providedIn: 'root'
})
export class ChemicalService {

    private readonly allChemicals$: BehaviorSubject<Chemical[]> = new BehaviorSubject<Chemical[]>([]);
    readonly filteredChemicals$: BehaviorSubject<Chemical[]> = new BehaviorSubject<Chemical[]>([]);
    loggedInUser = '';
    tableData = new MatTableDataSource<Chemical>(); // data source for table

    // TODO move these into a filter service?
    cupboardFilterControl = new UntypedFormControl('All');
    cupboardFilterValues: string[] = [];

    expiryFilterControl = new UntypedFormControl('Any');
    expiryFilterValues = ['Any', '< 30 Days', 'Expired'];

    labFilterControl = new UntypedFormControl('');
    labFilterValues: string[] = [];

    nameOrNumberSearchOptions: Observable<string[]> = new Observable();
    nameOrNumberSearchControl = new UntypedFormControl();

    ownerSearchOptions: Observable<string[]> = new Observable();
    ownerSearchControl = new UntypedFormControl();

    toggleArchiveControl = new UntypedFormControl(false);

    constructor(private http: HttpClient,
                private authService: AuthService,
                private hazardService: HazardService) {

        this.getChemicals();
        this.getLabs();
        this.getCupboards();
        // TODO does this function serve a purpose?
        this.getExpiryFilterValues();

        this.authService.user$.subscribe((user) => {
            this.loggedInUser = user?.email ?? '';
        });

        combineLatest([
            this.hazardService.hazardFilterControl,
            this.cupboardFilterControl,
            this.labFilterControl,
            this.expiryFilterControl,
            this.toggleArchiveControl,
            this.ownerSearchControl,
            this.nameOrNumberSearchControl
        ]
            .map((control) => control.valueChanges.pipe(startWith(control.value))))
            .subscribe(() => {
                this.filterChemicals(
                    this.toggleArchiveControl.value,
                    this.cupboardFilterControl.value,
                    this.hazardService.hazardFilterControl.value,
                    this.labFilterControl.value,
                    this.expiryFilterControl.value,
                    this.nameOrNumberSearchControl.value ?? '',
                    this.ownerSearchControl.value ?? ''
                );
                this.tableData.data = this.getFilteredChemicals();
            });
    }


    getAllChemicals(): Chemical[] {

        return this.allChemicals$.getValue();
    }


    setAllChemicals(chemicals: Chemical[]): void {
        this.allChemicals$.next(chemicals);
    }


    getFilteredChemicals() {

        return this.filteredChemicals$.getValue();
    }


    setFilteredChemicals(chemicals: Chemical[]): void {
        this.filteredChemicals$.next(chemicals);
    }


    getLabs() {
        this.http.get<string[]>(`${environment.backendUrl}/labs`).subscribe((labs) => {
            this.labFilterValues = labs.concat('All');
            this.labFilterControl.setValue('All');
        });
    }


    getCupboards() {
        this.http.get<string[]>(`${environment.backendUrl}/cupboards`).subscribe((cupboards) => {
            this.cupboardFilterValues = cupboards.concat('All');
            this.cupboardFilterControl.setValue('All');
        });
    }


    getExpiryFilterValues(): string[] {
        return this.expiryFilterValues;
    }


    // TODO move this to a filter service?
    filterChemicals = (includeArchived: boolean,
                       cupboard: string,
                       hazardCategory: string,
                       lab: string,
                       expiry: Expiry,
                       nameOrNumberSearchStr: string,
                       ownerSearchStr: string): Chemical[] => {

        const nameOrNumberSearchLower = nameOrNumberSearchStr.toLowerCase();
        const ownerSearchLower = ownerSearchStr.toLowerCase();

        const filteredChemicals = this.getAllChemicals()
            .filter((chemical) => includeArchived || !chemical.isArchived)
            .filter((chemical) => cupboard === 'All' || chemical.cupboard?.toLowerCase().trim() === cupboard) // Note that cupboard is now set to lower case
            .filter((chemical) => hazardCategory === 'All' ||
                chemical.hazards?.map((hazard) => hazard.toString()).includes(hazardCategory))
            .filter((chemical) => lab === 'All' || chemical.location === lab)
            .filter((chemical) => this.filterExpiryDate(chemical, expiry))
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

        this.setFilteredChemicals(filteredChemicals);

        return filteredChemicals;
    };


    private getChemicals(): void {
        this.http.get<Chemical[]>(`${environment.backendUrl}/chemicals`).subscribe((chemicals: Chemical[]) => {
            chemicals = chemicals.map((chemical) => {
                chemical.hazardList = this.hazardService.getHazardListForChemical(chemical);
                chemical.backgroundColour = this.getExpiryColour(chemical);

                return chemical;
            });
            this.setAllChemicals(chemicals);
            this.setFilteredChemicals(chemicals);
        });
    }


    // TODO move these functions to an expiry service?
    getExpiryColour(chemical: Chemical): ExpiryColor {

        const timeUntilExpiry = this.daysUntilExpiry(chemical);

        if (timeUntilExpiry < 30 && timeUntilExpiry > 0) {
            return yellow;
        }
        if (timeUntilExpiry <= 0) {
            return red;
        }

        return '';
    }


    private daysUntilExpiry(chemical: Chemical): number {
        return moment(chemical.expiry).startOf('day').diff(moment().startOf('day'), 'days');
    }


    filterExpiryDate(chemical: Chemical, expiry: Expiry): boolean {

        const timeUntilExpiry = this.daysUntilExpiry(chemical);

        switch (expiry) {
            case 'Any':

                return true;
            case '< 30 Days':

                return timeUntilExpiry < 30 && timeUntilExpiry > 0;
            case 'Expired':

                return timeUntilExpiry <= 0;
        }
    }


    // TODO do we need these 2 functions at all?
    getNameOrNumberSearchObservable(): Observable<string[]> {

        return this.nameOrNumberSearchControl.valueChanges.pipe(
            map((search) => this.getNames(
                this.getFilteredChemicals(),
                search)
            )
        );
    }


    getOwnerSearchObservable(): Observable<string[]> {

        return this.ownerSearchControl.valueChanges.pipe(
            map((search) => this.getOwners(
                this.getFilteredChemicals(),
                search)
            )
        );
    }


    archive(chemical: Chemical): void {
        chemical.isArchived = !chemical.isArchived;
        this.updateChemical(chemical);
        this.update(chemical);
    }


    // TODO move these 2 functions to a filter service?
    getNames = (chemicals: Chemical[], search: string): string[] => {
        const searchLower = search.toLowerCase();

        return chemicals
            .flatMap((chemical) => [chemical.name, chemical.chemicalNumber || ''])
            .filter((phrase) => phrase.toLowerCase().includes(searchLower))
            .sort()
            .filter((item, pos, array) => !pos || item != array[pos - 1]);  // deduplication
    };


    getOwners = (chemicals: Chemical[], search: string): string[] => {
        const searchLower = search.toLowerCase();

        return chemicals
            .map((chemical) => chemical.owner)
            .filter((phrase) => phrase?.toLowerCase().includes(searchLower))
            .sort()
            .filter((item, pos, array) => !pos || item != array[pos - 1]);  // deduplication
    };


    onChemicalAdded(chemical: Chemical): void {
        chemical.cupboard = chemical.cupboard?.toLowerCase().trim();
        this.http.post<Chemical>(`${environment.backendUrl}/chemical`, chemical).subscribe((addedChemical: Chemical) => {
            addedChemical.hazardList = this.hazardService.getHazardListForChemical(addedChemical);
            addedChemical.backgroundColour = this.getExpiryColour(addedChemical);
            this.setAllChemicals(this.getAllChemicals().concat(addedChemical));
            this.setFilteredChemicals(this.getFilteredChemicals().concat(addedChemical));
            // TODO do we actually need to do this?
            // this.nameOrNumberSearchOptions = this.getNameOrNumberSearchObservable();
            // this.ownerSearchOptions = this.getOwnerSearchObservable();
        });

    }


    onChemicalEdited(chemical: Chemical): void {
        chemical.hazardList = this.hazardService.getHazardListForChemical(chemical);
        chemical.backgroundColour = this.getExpiryColour(chemical);
        chemical.lastUpdatedBy = this.loggedInUser;
        this.updateChemical(chemical);
        this.hazardService.updateHazards(chemical);
        this.update(chemical);
        // TODO do we actually need to do this?
        // this.nameOrNumberSearchOptions = this.getNameOrNumberSearchObservable();
        // this.ownerSearchOptions = this.getOwnerSearchObservable();
    }


    update = (chemical: Chemical) => {
        const chemicalIndex = this.getAllChemicals().findIndex((chem) => chem.id === chemical.id);
        const allUpdatedChemicals = this.getAllChemicals();
        allUpdatedChemicals[chemicalIndex] = chemical;
        this.setAllChemicals(allUpdatedChemicals);
        this.filterChemicals(
            this.toggleArchiveControl.value,
            this.cupboardFilterControl.value,
            this.hazardService.hazardFilterControl.value,
            this.labFilterControl.value,
            this.expiryFilterControl.value,
            this.nameOrNumberSearchControl.value ?? '',
            this.ownerSearchControl.value ?? ''
        );
    };


    updateChemical(chemical: Chemical): void {
        // Lower case and remove trailing spaces from the cupboard name to make filtering and data integrity better
        chemical.cupboard = chemical.cupboard?.toLowerCase().trim();
        chemical.lastUpdatedBy = this.loggedInUser;
        this.http.put(`${environment.backendUrl}/chemical`, chemical).pipe(
            debounceTime(100)
        ).subscribe(() => {
            chemical.backgroundColour = this.getExpiryColour(chemical);
        });
    }

}
