import { AuthService } from '@auth0/auth0-angular';
import { combineLatest, debounceTime, map, Observable, startWith } from 'rxjs';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';

import { allHazards, Chemical, columnTypes, ExpiryColor, Hazard, red, yellow } from './types';
import { Chemicals } from './chemicals';
// environment.ts is added at compile time by npm run start command
import { isValidHttpUrl, checkDuplicates } from '../utility/utilities';
import { environment } from 'src/environments/environment';
import { FilterService } from '../filter.service';
import { HazardService } from '../services/hazard-service.service';
// import { SaveService } from '../services/save-service.service';
import { ScanChemicalComponent } from '../scan-chemical/scan-chemical.component';



@Component({
    selector: 'app-coshh',
    templateUrl: './coshh.component.html',
    styleUrls: ['./coshh.component.scss']
})
export class CoshhComponent implements OnInit {

    scanningMode: boolean = false;
    private scannedBarcode: string = '';
    dialogOpen: boolean = false;

    onDialogOpen(v:boolean): void {
        this.dialogOpen = v;
        this.scanningMode = !v;
    }


    barcodeScanned = () => {
        if (!this.dialogOpen) {
            const dialog = this.dialog.open(ScanChemicalComponent, {
                width: '20vw',
                data: {
                    chemicalNumber: this.scannedBarcode,
                    chemical: this.getChemicals()
                        .find((chemical) => chemical.chemicalNumber === this.scannedBarcode),
                    archive: this.updateChemical
                }
            });

            dialog.afterOpened().subscribe(() => {
                this.dialogOpen = true;
            });

            dialog.afterClosed().subscribe(() => {
                this.refresh();
                this.scannedBarcode = '';
                this.dialogOpen = false;
            });
        }
    };

    @HostListener('window:keypress', ['$event'])
    keyEvent(event: KeyboardEvent): void {
        event.key === 'Enter' && this.scanningMode ? this.barcodeScanned(): this.scannedBarcode += event.key;
    }

    isAuthenticated$ = this.authService.isAuthenticated$;

    displayedColumns = ['buttons', 'casNumber', 'name', 'hazards', 'location', 'cupboard', 'chemicalNumber', 'matterState',
        'quantity', 'added', 'expiry', 'safetyDataSheet', 'coshhLink', 'storageTemp', 'owner'];

    constructor(private http: HttpClient,
                private fb: UntypedFormBuilder,
                private _liveAnnouncer: LiveAnnouncer,
                private authService: AuthService,
                private filterService: FilterService,
                public dialog: MatDialog, 
                private HazardService: HazardService) {
    }

    chemicals = new Chemicals(); // this represents all the chemicals returned from the API
    cupboards: string[] = [];
    labs: string[] = [];
    users: string[] = [];
    freezeColumns = false;
    loggedInUser: string = '';

    // getHazardListForChemical = (chemical: Chemical) => {
    //     return allHazards().map((hazard: Hazard) => {
    //         return {
    //             title: hazard,
    //             activated: chemical.hazards ? chemical.hazards.includes(hazard) : false,
    //             value: hazard
    //         };
    //     });
    // };

    hazardFilterValues = (<string[]>allHazards()).concat('All');
    tableData = new MatTableDataSource<Chemical>(); // data source for table
    columns: string[] = columnTypes; // columns to display in table
    toggleArchiveControl = new UntypedFormControl(false);
    hazardFilterControl = new UntypedFormControl('All');

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

    tooltipText = () => {
        const numberOfChemicals = this.getChemicals().length;

        const chemicalOrChemicals = numberOfChemicals === 1 ? 'chemical' : 'chemicals';

        return `${numberOfChemicals} ${chemicalOrChemicals} found with current filters`;
    };


    @ViewChild(MatSort) sort!: MatSort;

    ngOnInit(): void {

        this.http.get<Array<Chemical>>(`${environment.backendUrl}/chemicals`)
            .subscribe((res: Array<Chemical>) => {
                res = res?.map((chem: Chemical) => {
                    chem.editSDS = false;
                    chem.editCoshh = false;
                    chem.backgroundColour = this.getExpiryColour(chem);
                    chem.hazardList = this.HazardService.getHazardListForChemical(chem);

                    return chem;
                });

                this.chemicals.set(res || []);
                const inStock = this.getChemicals();

                this.tableData = new MatTableDataSource<Chemical>(inStock);
                this.tableData.sort = this.sort;

                this.nameOrNumberSearchOptions = this.getNameOrNumberSearchObservable();
            });

        this.http.get<string[]>(`${environment.backendUrl}/labs`).subscribe((labs) => {
            this.labFilterValues = labs.concat('All');
            this.labFilterControl.setValue('All');
            this.labs = labs;
        });

        this.http.get<string[]>(`${environment.backendUrl}/users`).subscribe((users) => {
            this.users = users;
        });

        this.nameOrNumberSearchControl.valueChanges.subscribe(() => {
            this.tableData.data = this.getChemicals();
        });

        this.ownerSearchControl.valueChanges.subscribe(() => {
            this.tableData.data = this.getChemicals();
        });

        this.authService.user$.subscribe((user) => {
            this.loggedInUser = user?.email ?? '';
        });

        combineLatest([
                this.hazardFilterControl,
                this.cupboardFilterControl,
                this.labFilterControl,
                this.expiryFilterControl,
                this.toggleArchiveControl
            ].map((control) => control.valueChanges.pipe(startWith(control.value)))
        ).subscribe(() => {
            this.refresh();
            this.nameOrNumberSearchOptions = this.getNameOrNumberSearchObservable();
            this.ownerSearchOptions = this.getOwnerSearchObservable();
        });

    }

    getChemicals(): Chemical[] {
        return this.chemicals.get(
            this.toggleArchiveControl.value,
            this.cupboardFilterControl.value,
            this.hazardFilterControl.value,
            this.labFilterControl.value,
            this.expiryFilterControl.value,
            this.nameOrNumberSearchControl.value || '',
            this.ownerSearchControl.value || ''
        );
    }


    archive(chemical: Chemical): void {
        chemical.isArchived = !chemical.isArchived;
        this.updateChemical(chemical);

        this.refresh();
    }

    refresh(): void {
        this.tableData.data = this.getChemicals();
        this.refreshCupboardsFilterList();

    }

    /**
     * Show only cupboards for currently selected lab. If 'All' labs it will show cupboards currently used over all the chemicals.
     * 'All' is always an option for cupboards filter so append it to the list
     */
    refreshCupboardsFilterList(): void {
        if (this.labFilterControl.value == 'All') {
            this.filterService.getCupboards().subscribe((cupboards) => {
                const dedupedCupboards: string[] = checkDuplicates(cupboards);

                this.cupboardFilterValues = dedupedCupboards.concat('All');
                this.cupboards = dedupedCupboards;
            });
        } else {
            this.filterService.getCupboardsForLab(this.labFilterControl.value).subscribe((cupboards) => {
                const dedupedCupboards: string[] = checkDuplicates(cupboards);

                this.cupboardFilterValues = dedupedCupboards.concat('All');
                this.cupboards = dedupedCupboards;
            });
        }
    }

    updateChemical(chemical: Chemical, refresh?: boolean): void {
        // Lower case and remove trailing spaces from the cupboard name to make filtering and data integrity better
        chemical.cupboard = chemical.cupboard?.toLowerCase().trim();
        chemical.lastUpdatedBy = this.loggedInUser;
        this.http.put(`${environment.backendUrl}/chemical`, chemical).pipe(
            debounceTime(100)
        ).subscribe(() => {
            this.chemicals.update(chemical);
            chemical.backgroundColour = this.getExpiryColour(chemical);
            if (refresh) this.refresh();
        });

    }

    updateHazards(chemical: Chemical): void {
        return this.HazardService.updateHazards(chemical);
    }

    onChemicalAdded(chemical: Chemical): void {
        // Lower case and remove trailing spaces from the cupboard name to make filtering and data integrity better
        chemical.cupboard = chemical.cupboard?.toLowerCase().trim();
        this.http.post<Chemical>(`${environment.backendUrl}/chemical`, chemical).subscribe((addedChemical: Chemical) => {
            addedChemical.editSDS = false;
            addedChemical.editCoshh = false;
            addedChemical.hazardList = this.HazardService.getHazardListForChemical(addedChemical);  
            addedChemical.backgroundColour = this.getExpiryColour(chemical);
            this.chemicals.add(addedChemical);
            this.refresh();
            this.nameOrNumberSearchOptions = this.getNameOrNumberSearchObservable();
            this.ownerSearchOptions = this.getOwnerSearchObservable();
        });
    }


    onChemicalEdited(chemical: Chemical): void {
        chemical.editSDS = false;
        chemical.editCoshh = false;
        chemical.hazardList = this.HazardService.getHazardListForChemical(chemical);
        chemical.backgroundColour = this.getExpiryColour(chemical);
        chemical.lastUpdatedBy = this.loggedInUser;
        this.updateChemical(chemical);
        this.updateHazards(chemical);
        this.chemicals.update(chemical);
        this.refresh();
        this.nameOrNumberSearchOptions = this.getNameOrNumberSearchObservable();
        this.ownerSearchOptions = this.getOwnerSearchObservable();
    }

    getExpiryColour(chemical: Chemical): ExpiryColor {

        const timeUntilExpiry = Chemicals.daysUntilExpiry(chemical);

        if (timeUntilExpiry < 30 && timeUntilExpiry > 0) {
            return yellow;
        }
        if (timeUntilExpiry <= 0) {
            return red;
        }

        return '';
    }


    getNameOrNumberSearchObservable(): Observable<string[]> {
        return this.nameOrNumberSearchControl.valueChanges.pipe(
            map((search) => this.chemicals.getNames(
                this.getChemicals(),
                search)
            )
        );
    }

    getOwnerSearchObservable(): Observable<string[]> {
        return this.ownerSearchControl.valueChanges.pipe(
            map((search) => this.chemicals.getOwners(
                this.getChemicals(),
                search)
            )
        );
    }

    // set the activated property of all hazards other than the passed hazard to false and clear hazards from the passed chemical
    singleSelect(chemical: Chemical, hazardName: Hazard): Chemical {
        chemical.hazards = [hazardName];
        chemical.hazardList.forEach((hl) => {
            if (hl.title !== hazardName) {
                hl.activated = false;
            }
        });

        return chemical;
    }


    getHazardPicture(hazard: Hazard): string {
        return this.HazardService.getHazardPicture(hazard);
    }

    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) {
        // This example uses English messages. If your application supports
        // multiple language, you would internationalize these strings.
        // Furthermore, you can customize the message to add additional
        // details about the values being sorted.
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    savePDF() {
        // return this.saveService.savePDF();
    }

    // attempts to use css @media query to set print options programmatically were unsuccessful
    // in the print dialog window the user will need to change the orientation to landscape and the scale to 50% for
    // it to fit on an A4 page
    printInventory() {
        // return this.saveService.printInventory();
    }

    saveExcel() {
        // return this.saveService.saveExcel();
    }

    protected readonly isValidHttpUrl = isValidHttpUrl;

}