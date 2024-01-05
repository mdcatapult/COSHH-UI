import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';


import { Chemical } from '../coshh/types';
import { environment } from 'src/environments/environment';
import { CoshhComponent } from '../coshh/coshh.component';

@Injectable({
    providedIn: 'root'
})
export class ChemicalService implements OnInit {

    constructor(private http: HttpClient, private coshhobject: CoshhComponent) { }
    ngOnInit(): void {

     }

    onChemicalAdded(chemical: Chemical): void {
        // Lower case and remove trailing spaces from the cupboard name to make filtering and data integrity better
        chemical.cupboard = chemical.cupboard?.toLowerCase().trim();
        this.http.post<Chemical>(`${environment.backendUrl}/chemical`, chemical).subscribe((addedChemical: Chemical) => {
            addedChemical.editSDS = false;
            addedChemical.editCoshh = false;
            addedChemical.hazardList = this.coshhobject.getHazardListForChemical(addedChemical);
            addedChemical.backgroundColour = this.coshhobject.getExpiryColour(chemical);
            this.coshhobject.chemicals.add(addedChemical);
            this.coshhobject.refresh();
            this.coshhobject.nameOrNumberSearchOptions = this.coshhobject.getNameOrNumberSearchObservable();
            this.coshhobject.ownerSearchOptions = this.coshhobject.getOwnerSearchObservable();
        });
    }

    onChemicalEdited(chemical: Chemical): void {
        chemical.editSDS = false;
        chemical.editCoshh = false;
        chemical.hazardList = this.coshhobject.getHazardListForChemical(chemical);
        chemical.backgroundColour = this.coshhobject.getExpiryColour(chemical);
        chemical.lastUpdatedBy = this.coshhobject.loggedInUser;
        this.updateChemical(chemical);
        this.coshhobject.updateHazards(chemical);
        this.coshhobject.chemicals.update(chemical);
        this.coshhobject.refresh();
        this.coshhobject.nameOrNumberSearchOptions = this.coshhobject.getNameOrNumberSearchObservable();
        this.coshhobject.ownerSearchOptions = this.coshhobject.getOwnerSearchObservable();
    }


        updateChemical(chemical: Chemical, refresh?: boolean): void {
        // Lower case and remove trailing spaces from the cupboard name to make filtering and data integrity better
        chemical.cupboard = chemical.cupboard?.toLowerCase().trim();
        chemical.lastUpdatedBy = this.coshhobject.loggedInUser;
        this.http.put(`${environment.backendUrl}/chemical`, chemical).pipe(
            debounceTime(100)
        ).subscribe(() => {
            this.coshhobject.chemicals.update(chemical);
            chemical.backgroundColour = this.coshhobject.getExpiryColour(chemical);
            if (refresh) this.coshhobject.refresh();
        });
    }

}



