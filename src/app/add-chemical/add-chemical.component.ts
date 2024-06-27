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

import { catchError } from 'rxjs';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';

import { Chemical } from '../coshh/types';
import { ChemicalDialogComponent } from '../chemical-dialog/chemical-dialog.component';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from '../services/error-handler.service';


@Component({
  selector: 'app-add-chemical',
  templateUrl: './add-chemical.component.html',
  styleUrls: ['./add-chemical.component.scss']
})
export class AddChemicalComponent {

  constructor(
      private errorHandlerService: ErrorHandlerService,
      private http: HttpClient,
      public dialog: MatDialog) {
  }

  @Input() labs: string[] = [];
  @Input() users: string[] = [];
  @Output() onChemicalAdded = new EventEmitter<Chemical>();
  @Output() onDialogOpen = new EventEmitter<true>();


  addChemical(): void {
    this.onDialogOpen.emit(true);
    this.http.get<string>(`${environment.backendUrl}/chemical/maxchemicalnumber`)
    .pipe(catchError((error: HttpErrorResponse) => this.errorHandlerService.handleError(error)))
    .subscribe({
        next: (maxChemNo) => {
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
        }
      }
    );
  }
}