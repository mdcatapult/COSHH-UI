import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import * as moment from 'moment';
import { Chemical } from '../coshh/types';
import { ChemicalDialogComponent } from '../chemical-dialog/chemical-dialog.component';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-add-chemical',
    templateUrl: './add-chemical.component.html',
    styleUrls: ['./add-chemical.component.scss']
})
export class AddChemicalComponent implements OnInit {

    constructor(public dialog: MatDialog, private http: HttpClient) {
    }

    @Input() labs: string[] = [];
    @Input() users: string[] = [];
    @Output() onChemicalAdded = new EventEmitter<Chemical>();

    ngOnInit(): void {
    }

    addChemical(): void {
        this.http.get<string>(`${environment.backendUrl}/chemical/maxchemicalnumber`)
            .subscribe((maxChemNo) => {
                const formattedChemicalNumber = (parseInt(maxChemNo) + 1).toString().padStart(5, '0');

                const chemical = {
                    casNumber: '',
                    name: '',
                    chemicalNumber: formattedChemicalNumber,
                    matterState: '',
                    quantity: '',
                    added: moment(new Date(), 'DD-MM-YYY'),
                    expiry: moment(new Date(), 'DD-MM-YYY').add(5, 'y'),
                    safetyDataSheet: '',
                    coshhLink: '',
                    storageTemp: '',
                    location: '',
                    cupboard: '',
                    hazards: ['Unknown'],
                    owner: ''
                };

                const dialogRef = this.dialog.open(ChemicalDialogComponent, {
                    width: '50vw',
                    data: {
                        labs: this.labs,
                        users: this.users,
                        chemical: chemical
                    }
                });

                dialogRef.afterClosed().subscribe((chemical: Chemical) => {
                    if (chemical) {
                        this.onChemicalAdded.emit(chemical);
                    }
                });
            });
    }
}




