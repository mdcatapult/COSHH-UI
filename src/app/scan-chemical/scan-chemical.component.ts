import { catchError } from 'rxjs/operators';
import { Component, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Chemical } from '../coshh/types';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from '../services/error-handler.service';

@Component({
    selector: 'app-scan-chemical',
    templateUrl: './scan-chemical.component.html',
    styleUrls: ['./scan-chemical.component.scss']
})
export class ScanChemicalComponent {

    chemical: Chemical | undefined;
    errorMessage: string = '';

    constructor(
       private errorHandlerService: ErrorHandlerService,
        @Inject(MAT_DIALOG_DATA) public data: {
            chemicalNumber: string,
            chemical: Chemical
        },
        private http: HttpClient
    ) {
        this.chemical = data.chemical;
        if (!this.chemical) this.errorMessage = `No chemical number ${this.data.chemicalNumber} found`;
        if (this.chemical?.isArchived) this.errorMessage = `${this.data.chemical.name} has already been archived`;
    }

    archiveChemical(chemical: Chemical): void {

        const chemicalCopy = JSON.parse(JSON.stringify(chemical));

        chemicalCopy.isArchived = !chemicalCopy.isArchived;

        this.http.put(`${environment.backendUrl}/chemical`, chemicalCopy)
        .pipe(catchError((error: HttpErrorResponse) => this.errorHandlerService.handleError(error)))
        .subscribe(
            {
                next: () => {
                    chemical.isArchived = !chemical.isArchived;
                    this.errorHandlerService.setSuccessMessage(`${chemical.name} archived successfully`);
                }
        });
    }

}
