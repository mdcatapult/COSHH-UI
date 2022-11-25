import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ChemicalDialogComponent} from '../chemical-dialog/chemical-dialog.component';
import {Chemical} from '../coshh/types';
import * as moment from 'moment';


@Component({
    selector: 'app-edit-chemical',
    templateUrl: './edit-chemical.component.html',
    styleUrls: ['./edit-chemical.component.scss']
})
export class EditChemicalComponent implements OnInit {

    constructor(public dialog: MatDialog) {
    }

    @Input() labs: string[] = []
    @Input() projectSpecific: string[] = []
    @Input() chemical!: Chemical
    @Output() onChemicalEdited = new EventEmitter<Chemical>()

    ngOnInit(): void {
    }

    editChemical(): void {
        const dialogRef = this.dialog.open(ChemicalDialogComponent, {
            width: '50vw',
            data: {
                labs: this.labs,
                projectSpecific: this.projectSpecific,
                chemical: this.chemical,
            },
        })

        dialogRef.afterClosed().subscribe((chemical: Chemical) => {
            this.onChemicalEdited.emit(chemical)
        })
    }
}




