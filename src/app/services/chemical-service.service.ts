import * as moment from 'moment';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntypedFormControl } from '@angular/forms';

import { Chemical, ExpiryColor, yellow, red, Expiry } from '../coshh/types';
import { environment } from 'src/environments/environment';
import { HazardService } from './hazard-service.service';
import { MatTableDataSource } from '@angular/material/table';


@Injectable({
    providedIn: 'root'
})
export class ChemicalService {

    private readonly allChemicals$: BehaviorSubject<Chemical[]> = new BehaviorSubject<Chemical[]>([]);
    readonly filteredChemicals$: BehaviorSubject<Chemical[]> = new BehaviorSubject<Chemical[]>([]);

    tableData = new MatTableDataSource<Chemical>(); // data source for table
    loggedInUser = '';

    constructor(private http: HttpClient,
                private authService: AuthService,
                private hazardService: HazardService) {
        this.getChemicals();
        this.getLabs();
        this.getCupboards();
        this.getExpiryFilterValues();
        this.authService.user$.subscribe((user) => {
            this.loggedInUser = user?.email ?? '';
        });

        this.ownerSearchControl.valueChanges.subscribe(() => {

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

            console.log(this.tableData.data, '   <-- this tabledata.data in owner search control');
        });


        this.nameOrNumberSearchControl.valueChanges.subscribe(() => {

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

        this.labFilterControl.valueChanges.subscribe(() => {

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

        this.cupboardFilterControl.valueChanges.subscribe(() => {

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

        this.expiryFilterControl.valueChanges.subscribe(() => {

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

        this.hazardService.hazardFilterControl.valueChanges.subscribe(() => {

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

        this.toggleArchiveControl.valueChanges.subscribe(() => {

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


    labFilterControl = new UntypedFormControl('');
    labFilterValues: string[] = [];

    cupboardFilterControl = new UntypedFormControl('All');
    cupboardFilterValues: string[] = [];

    expiryFilterControl = new UntypedFormControl('Any');
    expiryFilterValues = ['Any', '< 30 Days', 'Expired'];

    nameOrNumberSearchOptions: Observable<string[]> = new Observable();
    nameOrNumberSearchControl = new UntypedFormControl();

    ownerSearchOptions: Observable<string[]> = new Observable();
    ownerSearchControl = new UntypedFormControl();

    toggleArchiveControl = new UntypedFormControl(false);


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
            console.log(this.getAllChemicals(), '   <-- this.getAllChemicals() in onChemicalAdded');
            // this.refresh();
            this.nameOrNumberSearchOptions = this.getNameOrNumberSearchObservable();
            this.ownerSearchOptions = this.getOwnerSearchObservable();
        });

    }

    onChemicalEdited(chemical: Chemical): void {
        chemical.hazardList = this.hazardService.getHazardListForChemical(chemical);
        chemical.backgroundColour = this.getExpiryColour(chemical);
        chemical.lastUpdatedBy = this.loggedInUser;
        console.log(chemical.lastUpdatedBy, '   <-- loggerUpdateBy');
        this.updateChemical(chemical);
        console.log(chemical, '   <-- chemical in onChemicalEdited');
        this.hazardService.updateHazards(chemical);
        this.update(chemical);
        this.nameOrNumberSearchOptions = this.getNameOrNumberSearchObservable();
        this.ownerSearchOptions = this.getOwnerSearchObservable();
    }

    updateChemical(chemical: Chemical): void {
        // Lower case and remove trailing spaces from the cupboard name to make filtering and data integrity better
        chemical.cupboard = chemical.cupboard?.toLowerCase().trim();
        chemical.lastUpdatedBy = this.loggedInUser;
        this.http.put(`${environment.backendUrl}/chemical`, chemical).pipe(
            debounceTime(100)
        ).subscribe(() => {
            chemical.backgroundColour = this.getExpiryColour(chemical);
            // if (refresh) this.coshhcomponent.refresh();
        });
    }

    update = (chemical: Chemical) => {
        const chemicalIndex = this.getFilteredChemicals().findIndex((chem) => chem.id === chemical.id);

                         
        this.getFilteredChemicals()[chemicalIndex] = chemical;
    };

}
