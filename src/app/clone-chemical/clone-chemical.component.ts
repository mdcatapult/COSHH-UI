import { catchError } from 'rxjs/operators';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';


import { Chemical } from '../coshh/types';
import { ChemicalDialogComponent } from '../chemical-dialog/chemical-dialog.component';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from '../services/error-handler.service';
import moment from 'moment';


@Component({
    selector: 'app-clone-chemical',
    templateUrl: './clone-chemical.component.html',
    styleUrls: ['./clone-chemical.component.scss']
})
export class CloneChemicalComponent {

    constructor(private errorHandlerService: ErrorHandlerService,
                public dialog: MatDialog,
                private http: HttpClient) {
    }

    @Input() labs: string[] = [];
    @Input() chemical!: Chemical;
    @Input() users: string[] = [];
    @Output() onChemicalCloned = new EventEmitter<Chemical>();

    cloneChemical(): void {
        this.http.get<string>(`${environment.backendUrl}/chemical/maxchemicalnumber`).pipe(
            catchError((error: HttpErrorResponse) => this.errorHandlerService.handleError(error)))
            .subscribe({
                next: (maxChemNo) => {
                    // clone chemical
                    const newChemical = JSON.parse(JSON.stringify(this.chemical));

                    // update chemical number
                    newChemical.chemicalNumber = (parseInt(maxChemNo) + 1).toString().padStart(5, '0');
                    // update added and expiry dates
                    newChemical.added = moment(new Date(), 'DD-MM-YYY');
                    newChemical.expiry = moment(new Date(), 'DD-MM-YYY').add(5, 'y');
                    const dialogRef = this.dialog.open(ChemicalDialogComponent, {
                        data: {
                            labs: this.labs,
                            users: this.users,
                            chemical: newChemical
                        }
                    });

                    dialogRef.afterClosed().subscribe((chemical: Chemical) => {
                        if (chemical) this.onChemicalCloned.emit(chemical);
                    });
                }
            });
    }

}
