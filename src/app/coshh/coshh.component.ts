import { AuthService } from '@auth0/auth0-angular';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { UntypedFormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { Chemical, columnTypes, Hazard } from './types';
// environment.ts is added at compile time by npm run start command
import { environment } from 'src/environments/environment';
import { ChemicalService } from '../services/chemical-service.service';
import { FilterService } from '../services/filter.service';
import { HazardService } from '../services/hazard-service.service';
import { isValidHttpUrl, checkDuplicates } from '../utility/utilities';
import { SaveService } from '../services/save-service.service';
import { ScanChemicalComponent } from '../scan-chemical/scan-chemical.component';
import {Observable} from "rxjs";


@Component({
    selector: 'app-coshh',
    templateUrl: './coshh.component.html',
    styleUrls: ['./coshh.component.scss']
})
export class CoshhComponent implements OnInit {

    // TODO move these functions into a scanning service?
    scanningMode: boolean = false;
    private scannedBarcode: string = '';
    dialogOpen: boolean = false;

    onDialogOpen(v: boolean): void {
        this.dialogOpen = v;
        this.scanningMode = !v;
    }


    barcodeScanned = () => {
        if (!this.dialogOpen) {
            const dialog = this.dialog.open(ScanChemicalComponent, {
                width: '20vw',
                data: {
                    chemicalNumber: this.scannedBarcode,
                    chemical: this.chemicalService.getAllChemicals()
                        .find((chemical) => chemical.chemicalNumber === this.scannedBarcode),
                    archive: this.chemicalService.updateChemical
                }
            });

            dialog.afterOpened().subscribe(() => {
                this.dialogOpen = true;
            });

            dialog.afterClosed().subscribe(() => {
                this.scannedBarcode = '';
                this.dialogOpen = false;
            });
        }
    };

    constructor(private authService: AuthService,
                public chemicalService: ChemicalService,
                public dialog: MatDialog,
                private fb: UntypedFormBuilder,
                private filterService: FilterService,
                public hazardService: HazardService,
                private http: HttpClient,
                private _liveAnnouncer: LiveAnnouncer,
                public saveService: SaveService) {

    }

    columns: string[] = columnTypes; // columns to display in table
    cupboards: string[] = [];
    displayedColumns = ['buttons', 'casNumber', 'name', 'hazards', 'location', 'cupboard', 'chemicalNumber', 'matterState',
        'quantity', 'added', 'expiry', 'safetyDataSheet', 'coshhLink', 'storageTemp', 'owner'];
    freezeColumns = false;
    isAuthenticated$ = this.authService.isAuthenticated$;
    loggedInUser: string = '';
    nameOrNumberSearchOptions: Observable<string[]> = new Observable();
    ownerSearchOptions: Observable<string[]> = new Observable();
    tableData!: MatTableDataSource<Chemical>;
    users: string[] = [];

    @HostListener('window:keypress', ['$event'])
    keyEvent(event: KeyboardEvent): void {
        event.key === 'Enter' && this.scanningMode ? this.barcodeScanned() : this.scannedBarcode += event.key;
    }
    @ViewChild(MatSort) sort!: MatSort;


    ngOnInit(): void {
        this.ownerSearchOptions = this.chemicalService.getOwnerSearchObservable();
        this.nameOrNumberSearchOptions = this.chemicalService.getNameOrNumberSearchObservable();
        this.tableData = new MatTableDataSource();
        this.chemicalService.filteredChemicals$
            .subscribe((filteredChemicals) => {
                this.tableData.data = filteredChemicals;
                this.tableData.sort = this.sort;
            });

        // TODO move this to a user service?
        this.http.get<string[]>(`${environment.backendUrl}/users`).subscribe((users) => {
            this.users = users;
        });
    }


    /**
     * Show only cupboards for currently selected lab. If 'All' labs it will show cupboards currently used over all the chemicals.
     * 'All' is always an option for cupboards filter so append it to the list
     */
    refreshCupboardsFilterList(): void {
        if (this.chemicalService.labFilterControl.value == 'All') {
            this.filterService.getCupboards().subscribe((cupboards) => {
                const dedupedCupboards: string[] = checkDuplicates(cupboards);

                this.chemicalService.cupboardFilterValues = dedupedCupboards.concat('All');
                this.cupboards = dedupedCupboards;
            });
        } else {
            this.filterService.getCupboardsForLab(this.chemicalService.labFilterControl.value).subscribe((cupboards) => {
                const dedupedCupboards: string[] = checkDuplicates(cupboards);

                this.chemicalService.cupboardFilterValues = dedupedCupboards.concat('All');
                this.cupboards = dedupedCupboards;
            });
        }
    }


    tooltipText = () => {
        const numberOfChemicals = this.chemicalService.getFilteredChemicals().length;
        const chemicalOrChemicals = numberOfChemicals === 1 ? 'chemical' : 'chemicals';

        return `${numberOfChemicals} ${chemicalOrChemicals} found with current filters`;
    };


    protected readonly isValidHttpUrl = isValidHttpUrl;

}