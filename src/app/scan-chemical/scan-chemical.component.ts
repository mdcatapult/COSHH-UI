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
