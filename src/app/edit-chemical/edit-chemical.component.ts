import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { Chemical } from '../coshh/types';
import { ChemicalDialogComponent } from '../chemical-dialog/chemical-dialog.component';


@Component({
    selector: 'app-edit-chemical',
    templateUrl: './edit-chemical.component.html',
    styleUrls: ['./edit-chemical.component.scss']
})
export class EditChemicalComponent implements OnInit {

    constructor(public dialog: MatDialog) {
    }

    @Input() labs: string[] = [];
    @Input() chemical!: Chemical;
    @Input() users: string[] = [];
    @Output() onChemicalEdited = new EventEmitter<Chemical>();

    ngOnInit(): void {
    }

    editChemical(): void {
        const dialogRef = this.dialog.open(ChemicalDialogComponent, {
            width: '50vw',
            data: {
                labs: this.labs,
                users: this.users,
                chemical: this.chemical
            }
        });


        dialogRef.afterClosed().subscribe((chemical: Chemical) => {
            if (chemical) this.onChemicalEdited.emit(chemical);
        });
    }
}




