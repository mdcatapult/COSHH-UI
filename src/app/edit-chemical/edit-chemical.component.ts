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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

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




