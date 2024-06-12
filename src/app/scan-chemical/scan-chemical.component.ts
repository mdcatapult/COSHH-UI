import { catchError } from 'rxjs/operators';
import { Component, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Chemical } from '../coshh/types';
import { environment } from '../../environments/environment';
import { handleError } from '../utility/utilities';

@Component({
    selector: 'app-scan-chemical',
    templateUrl: './scan-chemical.component.html',
    styleUrls: ['./scan-chemical.component.scss']
})
export class ScanChemicalComponent {

    chemical: Chemical | undefined;
    errorMessage: string = '';

    constructor(
        private http: HttpClient,
        @Inject(MAT_DIALOG_DATA) public data: {
            chemicalNumber: string,
            chemical: Chemical
        }
    ) {
        this.chemical = data.chemical;
        if (!this.chemical) this.errorMessage = `No chemical number ${this.data.chemicalNumber} found`;
        if (this.chemical?.isArchived) this.errorMessage = `${this.data.chemical.name} has already been archived`;
    }

    archiveChemical(chemical: Chemical): void {
        chemical.isArchived = !chemical.isArchived;
        this.http.put(`${environment.backendUrl}/chemical`, chemical)
        .pipe(catchError((error: HttpErrorResponse) => handleError(error)))
        .subscribe(
            {
                next: (chem) => console.info(`${chemical.name} archived`, chem),
                error: (err: HttpErrorResponse) => {
                    console.error(`Failed to archive ${chemical.name} due to ${err.message}`);
            }
        });
    }

}
