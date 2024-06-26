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
