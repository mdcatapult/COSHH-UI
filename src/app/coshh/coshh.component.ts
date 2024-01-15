import { AuthService } from '@auth0/auth0-angular';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { UntypedFormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { Chemical, columnTypes } from './types';
import { ChemicalService } from '../services/chemical.service';
import { FilterService } from '../services/filter.service';
import { HazardService } from '../services/hazard.service';
import { isValidHttpUrl } from '../utility/utilities';
import { SaveService } from '../services/save.service';
import { ScanChemicalComponent } from '../scan-chemical/scan-chemical.component';
import { Observable } from 'rxjs';


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

        this.filterService.getUsers().subscribe((users) => {
            this.users = users;
        });
    }


    tooltipText = () => {
        const numberOfChemicals = this.chemicalService.getFilteredChemicals().length;

        const chemicalOrChemicals = numberOfChemicals === 1 ? 'chemical' : 'chemicals';

        return `${numberOfChemicals} ${chemicalOrChemicals} found with current filters`;
    };


    protected readonly isValidHttpUrl = isValidHttpUrl;

}