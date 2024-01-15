import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { allHazards } from '../coshh/types';
import { Chemical } from '../coshh/types';
import { environment } from 'src/environments/environment';
import { Hazard } from '../coshh/types';

@Injectable({
    providedIn: 'root'
})
export class HazardService {
    constructor(private http: HttpClient) { }

    hazardFilterValues = (<string[]>allHazards()).concat('All');
    hazardFilterControl = new UntypedFormControl('All');

    getHazardPicture(hazard: Hazard): string {
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
    }
    

    updateHazards(chemical: Chemical): void {
        this.http.put(`${environment.backendUrl}/hazards`, chemical).pipe(
            debounceTime(100)
        ).subscribe((changes) => {
            console.log(changes, 'changes');
            console.log(chemical, 'chemical');
        });
    };


    getHazardListForChemical = (chemical: Chemical) => {
        return allHazards().map((hazard: Hazard) => {
            return {
                title: hazard,
                activated: chemical.hazards ? chemical.hazards.includes(hazard) : false,
                value: hazard
            };
        });
    };

}
