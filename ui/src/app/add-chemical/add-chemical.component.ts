import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ChemicalDialogComponent} from '../chemical-dialog/chemical-dialog.component';
import {Chemical} from '../coshh/types';
import * as moment from 'moment';


@Component({
    selector: 'app-add-chemical',
    templateUrl: './add-chemical.component.html',
    styleUrls: ['./add-chemical.component.scss']
})
export class AddChemicalComponent implements OnInit {

    constructor(public dialog: MatDialog) {
    }

    @Input() labs: string[] = []
    @Input() projectSpecific: string[] = []
    @Output() onChemicalAdded = new EventEmitter<Chemical>()

    ngOnInit(): void {
    }

    addChemical(): void {
        let chemical = {
            casNumber: '',
            name: '',
            chemicalNumber: '',
            matterState: '',
            quantity: '',
            added: moment(new Date(), "DD-MM-YYY"),
            expiry: moment(new Date(), "DD-MM-YYY").add(5, 'y'),
            safetyDataSheet: '',
            coshhLink: '',
            storageTemp: '',
            location: '',
            cupboard: '',
            hazards: ['Unknown'],
            projectSpecific: '',
        }
        const dialogRef = this.dialog.open(ChemicalDialogComponent, {
            width: '50vw',
            data: {
                labs: this.labs,
                projectSpecific: this.projectSpecific,
                chemical: chemical,
            },
        })

        dialogRef.afterClosed().subscribe((chemical: Chemical) => {
            if (chemical) {
                this.onChemicalAdded.emit(chemical)
            }
        })
    }
}




