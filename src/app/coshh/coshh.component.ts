/*
 * Copyright 2024 Medicines Discovery Catapult
 * Licensed under the Apache License, Version 2.0 (the "Licence");
 * you may not use this file except in compliance with the Licence.
 * You may obtain a copy of the Licence at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import { AuthService } from '@auth0/auth0-angular';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';

import { Chemical } from './types';
import { ChemicalService } from '../services/chemical.service';
import { DataService } from '../services/data.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { HazardService } from '../services/hazard.service';
import { isValidHttpUrl } from '../utility/utilities';
import { SaveService } from '../services/save.service';
import { ScanningService } from '../services/scanning.service';


@Component({
    selector: 'app-coshh',
    templateUrl: './coshh.component.html',
    styleUrls: ['./coshh.component.scss']
})
export class CoshhComponent implements OnInit {

    declare isAuthenticated$: Observable<boolean>;

    constructor(private authService: AuthService,
                public chemicalService: ChemicalService,
                private errorHandlerService: ErrorHandlerService,
                private filterService: DataService,
                public hazardService: HazardService,
                public saveService: SaveService,
                public scanningService: ScanningService,
                private _snackBar: MatSnackBar) {

        this.isAuthenticated$ = this.authService.isAuthenticated$;

    }

    // N.B. the order of the columns in the displayedColumns array determines the order of the columns in the table
    displayedColumns = ['buttons', 'casNumber', 'name', 'hazards', 'location', 'cupboard', 'chemicalNumber', 'matterState',
        'quantity', 'added', 'expiry', 'safetyDataSheet', 'coshhLink', 'storageTemp', 'owner'];
    freezeColumns = false;
    loggedInUser: string = '';
    nameOrNumberSearchOptions: Observable<string[]> = new Observable<string[]>();
    ownerSearchOptions: Observable<string[]> = new Observable<string[]>();
    tableData!: MatTableDataSource<Chemical>;
    users: string[] = [];

    @HostListener('window:keypress', ['$event'])
    keyEvent(event: KeyboardEvent): void {
        // disregard any key presses if not in scanning mode
        if (!this.scanningService.scanningMode) return;
        // barcode scanners work as inputs, so scanning a barcode will be the same as typing the numbers in and hitting
        // enter, so we listen for the enter key and treat it as a barcode scan
        event.key === 'Enter' ? this.scanningService.barcodeScanned()
            : this.scanningService.scannedBarcode += event.key;
    }

    @ViewChild(MatSort) sort!: MatSort;


    ngOnInit(): void {
        this.ownerSearchOptions = this.chemicalService.getOwnerSearchObservable();
        this.nameOrNumberSearchOptions = this.chemicalService.getNameOrNumberSearchObservable();

        this.tableData = new MatTableDataSource();
        // subscribe to filteredChemicals$ and update and sort tableData when it changes
        this.chemicalService.filteredChemicals$
            .subscribe((filteredChemicals) => {
                this.tableData.data = filteredChemicals;
                this.tableData.sort = this.sort;
            });

        this.filterService.getUsers().subscribe((users) => {
            this.users = users;
        });

        this.errorHandlerService.errorMessage$.subscribe((message) => {
            if (message) {
                this._snackBar.open(
                    message,
                    'OK',
                    {
                        verticalPosition: 'top',
                        horizontalPosition: 'center',
                        panelClass: 'error-snackbar'
                    }
                )
                    .onAction().subscribe(() => {
                    this.errorHandlerService.setErrorMessage('');
                });
            }
        });

        this.errorHandlerService.successMessage$.subscribe((message) => {
            if (message) {
                this._snackBar.open(
                    message,
                    'OK',
                    {
                        duration: 5000,
                        verticalPosition: 'top',
                        horizontalPosition: 'center',
                        panelClass: 'success-snackbar'
                    }
                )
                    .onAction().subscribe(() => {
                    this.errorHandlerService.setSuccessMessage('');
                });
            }
        });
    }


    tooltipText = () => {
        const numberOfChemicals = this.chemicalService.getFilteredChemicals().length;

        const chemicalOrChemicals = numberOfChemicals === 1 ? 'chemical' : 'chemicals';

        return `${numberOfChemicals} ${chemicalOrChemicals} found with current filters`;
    };


    protected readonly isValidHttpUrl = isValidHttpUrl;

}