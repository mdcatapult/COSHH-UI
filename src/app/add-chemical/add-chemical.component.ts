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