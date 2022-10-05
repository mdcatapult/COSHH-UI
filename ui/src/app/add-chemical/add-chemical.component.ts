import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AddChemicalDialogComponent} from '../add-chemical-dialog/add-chemical-dialog.component';
import {Chemical} from '../coshh/types';


@Component({
    selector: 'app-add-chemical',
    templateUrl: './add-chemical.component.html',
    styleUrls: ['./add-chemical.component.scss']
})
export class AddChemicalComponent implements OnInit {

    constructor(public dialog: MatDialog) {
    }

    @Input() labs: string[] = []
    @Input() projectCodes: string[] = []
    @Input() projectNames: string[] = []
    @Output() onChemicalAdded = new EventEmitter<Chemical>()

    ngOnInit(): void {
    }

    addChemical(): void {
        const dialogRef = this.dialog.open(AddChemicalDialogComponent, {
            width: '50vw',
            data: {
                labs: this.labs,
                projectCodes: this.projectCodes,
                projectNames: this.projectNames
            },
        })

        dialogRef.afterClosed().subscribe((chemical: Chemical) => {
            this.onChemicalAdded.emit(chemical)
        })
    }
}




