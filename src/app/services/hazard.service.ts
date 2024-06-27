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
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { allHazards, Chemical, Hazard, HazardListItem } from '../coshh/types';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from './error-handler.service';


// This service is used to get the hazard picture for a given hazard and to update the hazards for a given chemical
@Injectable({
    providedIn: 'root'
})
export class HazardService {
    constructor(private errorHandlerService: ErrorHandlerService,
                private http: HttpClient) {
    }

    getHazardPicture = (hazard: Hazard): string => {
        switch (hazard) {
            case 'Corrosive':
                return 'assets/corrosive.jpg';
            case 'Hazardous to the environment':
                return 'assets/environment.jpg';
            case 'Explosive':
                return 'assets/explosive.jpg';
            case 'Flammable':
                return 'assets/flammable.jpg';
            case 'Gas under pressure':
                return 'assets/gas.jpg';
            case 'Health hazard/Hazardous to the ozone layer':
                return 'assets/health.jpg';
            case 'Oxidising':
                return 'assets/oxidising.jpg';
            case 'Serious health hazard':
                return 'assets/serious.jpg';
            case 'Acute toxicity':
                return 'assets/toxic.jpg';
            case 'None':
                return 'assets/non-hazardous.jpg';
            default:
                return 'assets/unknown.jpg';
        }
    };


    updateHazards = (chemical: Chemical): void => {
        this.http.put(`${environment.backendUrl}/hazards`, chemical)
            .pipe(catchError((error: HttpErrorResponse) => this.errorHandlerService.handleError(error)))
            .subscribe({
                next: () => {
                    chemical.hazardList = this.getHazardListForChemical(chemical);
                }
            });

    };


    getHazardListForChemical = (chemical: Chemical): HazardListItem[] => {

        return allHazards().map((hazard: Hazard): HazardListItem => {
            return {
                title: hazard,
                activated: chemical.hazards ? chemical.hazards.includes(hazard) : false,
                value: hazard
            };
        });
    };

}
