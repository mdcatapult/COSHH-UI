import { Component, Inject } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Validators, FormControl, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

import { getAutocompleteObservable, urlValidator } from '../utility/utilities';
import { Chemical, HazardCategory, allHazards } from '../coshh/types';

@Component({
    selector: 'app-chemical-dialog',
    templateUrl: './chemical-dialog.component.html',
    styleUrls: ['./chemical-dialog.component.scss']
})
export class ChemicalDialogComponent {

    hazardCategoryList: HazardCategory[];
    masterCheckbox: boolean;
    form: FormGroup;
    selectedHazardCategories: string[];

    constructor(
        public dialogRef: MatDialogRef<ChemicalDialogComponent>,
        private dateAdapter: DateAdapter<Date>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: {
            labs: string[],
            users: string[],
            chemical: Chemical,
        }
    ) {
        dialogRef.disableClose = true;

        const chemical = this.data.chemical;

        this.dateAdapter.setLocale('en-GB');
        this.masterCheckbox = false;
        this.hazardCategoryList = allHazards().map((hazard) => {
            return {
                name: hazard,
                selected: chemical.hazards?.includes(hazard) ?? false
            };
        });

        // if no hazards are selected, if so select 'Unknown'
        if (this.hazardCategoryList.every((hazard) => !hazard.selected)) {
           this.hazardCategoryList.find((hazard) => hazard.name === 'Unknown')!.selected = true;
        }

        this.selectedHazardCategories = chemical.hazards;

        this.form = this.fb.group({
            casNumber: new FormControl(chemical.casNumber, Validators.pattern(/^([1-9]{1}\d{1,5}-\d{2}-\d|N\/?A)$/i)),
            name: new FormControl(chemical.name, Validators.required),
            chemicalNumber: new FormControl(chemical.chemicalNumber, [Validators.required, Validators.pattern(/[0-9]{5}/)]),
            matterState: new FormControl(chemical.matterState, Validators.required),
            quantity: new FormControl(chemical.quantity, Validators.required),
            added: new FormControl(chemical.added, Validators.required),
            expiry: new FormControl(chemical.expiry, Validators.required),
            safetyDataSheet: new FormControl(chemical.safetyDataSheet, urlValidator()),
            coshhLink: new FormControl(chemical.coshhLink, urlValidator()),
            storageTemp: new FormControl(chemical.storageTemp, Validators.required),
            location: new FormControl(chemical.location),
            cupboard: new FormControl(chemical.cupboard),
            hazards: this.buildHazards(),
            owner: new FormControl(chemical.owner, this.requireMatch.bind(this))
        }, { updateOn: 'change' });
    }


    convertToFormControl(name: string) {
        return this.form.get(name) as FormControl;
    }

    ownerOptions: Observable<string[]> = new Observable();

    urlFeedback(): string {
        const invalidSDSLink = this.form.get('safetyDataSheet')?.errors?.['invalidURL'];

        const invalidCOSHHLink = this.form.get('coshhLink')?.errors?.['invalidURL'];

        const invalidLinks = invalidSDSLink && invalidCOSHHLink;

        return `Invalid ${invalidSDSLink ? 'Safety Data Sheet' : ''} ${invalidLinks ? 'and' : ''} ${invalidCOSHHLink ? 'COSHH' : ''} ${invalidLinks ? 'links' : 'link'}: please ensure URL${invalidLinks? 's' : ''} ${invalidLinks ? 'are' : 'is'} valid or leave field${invalidLinks ? 's': ''} blank`;
    }

    ngOnInit(): void {
        this.ownerOptions = getAutocompleteObservable(this.form.controls['owner'] as FormControl, this.data.users);
        // validate the form so any invalid fields are highlighted
        this.form.markAllAsTouched();
    }

    buildHazards() {
        const hazards = this.hazardCategoryList.map((hazard) => this.fb.control(hazard.selected));

        return this.fb.array(hazards);
    }

    requireMatch(control: AbstractControl) {

        return this.data.users?.includes(control.value) || !control.value ? null : { incorrect: true };
    }

    onClose(): void {
        const chemical = {
            ...this.data.chemical,
            ...this.form.value
        };

        chemical.hazards = this.selectedHazardCategories;
        this.form.valid && this.dialogRef.close(chemical);
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    removeHazardFromSelectedHazardList(hazardName: string): void {
        if (this.selectedHazardCategories.indexOf(hazardName) >= 0) {
            this.selectedHazardCategories.splice(this.selectedHazardCategories.indexOf(hazardName), 1);
        }
    }

    uncheckHazard(hazardName: string): void {
        const hazardNameIndex = this.hazardCategoryList
            .findIndex((hazardCategory: HazardCategory) => hazardCategory.name === hazardName);

        this.hazardCategoryList[hazardNameIndex].selected = false;
    }

    removeHazard(hazardName: string): void {
        this.removeHazardFromSelectedHazardList(hazardName);
        this.uncheckHazard(hazardName);
    }

    onCheckboxChange(event: MatCheckboxChange, index: number): void {
        const changedCategory = this.hazardCategoryList[index];

        if (event.checked) {
            switch (changedCategory.name) {
                case 'None':
                case 'Unknown':
                    // uncheck all checkboxes
                    this.hazardCategoryList.forEach((hazard: HazardCategory) => hazard.selected = false);
                    // recheck 'None' or 'Unknown' accordingly
                    this.hazardCategoryList[index].selected = true;
                    // add the hazard to selectedHazardCategories
                    this.selectedHazardCategories = [changedCategory.name];
                    break;
                default:
                    // remove 'None' and 'Unknown' from selectedHazardList and set selected to false in hazardCategoryList
                    this.removeHazard('None');
                    this.removeHazard('Unknown');
                    // add the hazard to selectedHazardCategories
                    this.selectedHazardCategories.push(changedCategory.name);
                    // set the selected property of the hazard to true in hazardCategoryList
                    this.hazardCategoryList[index].selected = true;
            }
        } else {
            // remove the unchecked item from selectedHazardCategories
            this.selectedHazardCategories.splice(this.selectedHazardCategories.indexOf(changedCategory.name), 1);
            // set the selected property of the hazard to false in hazardCategoryList
            this.hazardCategoryList[index].selected = false;
        }
    }
}




