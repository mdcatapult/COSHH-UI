import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';

import { Chemical } from '../coshh/types';
import { CoshhComponent } from '../coshh/coshh.component';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ChemicalService implements OnInit {

    constructor(private http: HttpClient, private coshhcomponent: CoshhComponent) { }
    ngOnInit(): void {

     }

    onChemicalAdded(chemical: Chemical): void {
        // Lower case and remove trailing spaces from the cupboard name to make filtering and data integrity better
        chemical.cupboard = chemical.cupboard?.toLowerCase().trim();
        this.http.post<Chemical>(`${environment.backendUrl}/chemical`, chemical).subscribe((addedChemical: Chemical) => {
            addedChemical.editSDS = false;
            addedChemical.editCoshh = false;
            addedChemical.hazardList = this.coshhcomponent.getHazardListForChemical(addedChemical);
            addedChemical.backgroundColour = this.coshhcomponent.getExpiryColour(chemical);
            this.coshhcomponent.chemicals.add(addedChemical);
            this.coshhcomponent.refresh();
            this.coshhcomponent.nameOrNumberSearchOptions = this.coshhcomponent.getNameOrNumberSearchObservable();
            this.coshhcomponent.ownerSearchOptions = this.coshhcomponent.getOwnerSearchObservable();
        });
    }

    onChemicalEdited(chemical: Chemical): void {
        chemical.editSDS = false;
        chemical.editCoshh = false;
        chemical.hazardList = this.coshhcomponent.getHazardListForChemical(chemical);
        chemical.backgroundColour = this.coshhcomponent.getExpiryColour(chemical);
        chemical.lastUpdatedBy = this.coshhcomponent.loggedInUser;
        this.updateChemical(chemical);
        this.coshhcomponent.updateHazards(chemical);
        this.coshhcomponent.chemicals.update(chemical);
        this.coshhcomponent.refresh();
        this.coshhcomponent.nameOrNumberSearchOptions = this.coshhcomponent.getNameOrNumberSearchObservable();
        this.coshhcomponent.ownerSearchOptions = this.coshhcomponent.getOwnerSearchObservable();
    }


        updateChemical(chemical: Chemical, refresh?: boolean): void {
        // Lower case and remove trailing spaces from the cupboard name to make filtering and data integrity better
        chemical.cupboard = chemical.cupboard?.toLowerCase().trim();
        chemical.lastUpdatedBy = this.coshhcomponent.loggedInUser;
        this.http.put(`${environment.backendUrl}/chemical`, chemical).pipe(
            debounceTime(100)
        ).subscribe(() => {
            this.coshhcomponent.chemicals.update(chemical);
            chemical.backgroundColour = this.coshhcomponent.getExpiryColour(chemical);
            if (refresh) this.coshhcomponent.refresh();
        });
    }

}



