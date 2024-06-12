import { catchError } from 'rxjs';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


import moment from 'moment';
import { Chemical } from '../coshh/types';
import { ChemicalDialogComponent } from '../chemical-dialog/chemical-dialog.component';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { handleError } from '../utility/utilities';


@Component({
  selector: 'app-add-chemical',
  templateUrl: './add-chemical.component.html',
  styleUrls: ['./add-chemical.component.scss']
})
export class AddChemicalComponent {

  constructor(public dialog: MatDialog, private http: HttpClient) {
  }

  @Input() labs: string[] = [];
  @Input() users: string[] = [];
  @Output() onChemicalAdded = new EventEmitter<Chemical>();
  @Output() onDialogOpen = new EventEmitter<true>();


  addChemical(): void {
    this.onDialogOpen.emit(true);
    this.http.get<string>(`${environment.backendUrl}/chemical/maxchemicalnumber`)
    .pipe(catchError((error: HttpErrorResponse) => handleError(error)))
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
        },
        error: (error) => {
          // use console.error to notify the user of the error
          console.error('Error fetching max chemical number from add-chemical-component', error.message);
        }
      }
    );
  }
}