import {Component, Inject} from '@angular/core';
import {Validators, FormControl, UntypedFormControl, FormBuilder} from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment';
import {Observable} from "rxjs";
import {getAutocompleteObservable} from "../utility/utilities";
import {Chemical, HazardCategory, allHazards} from "../coshh/types"

@Component({
    selector: 'app-chemical-dialog',
    templateUrl: './chemical-dialog.component.html',
    styleUrls: ['./chemical-dialog.component.scss']
})
export class ChemicalDialogComponent {

    hazardCategoryList: HazardCategory[]
    masterCheckbox: boolean
    form: any
    selectedHazardCategories: string[]

    constructor(
        public dialogRef: MatDialogRef<ChemicalDialogComponent>,
        private dateAdapter: DateAdapter<Date>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: {
            labs: string[],
            projectSpecific: string[],
            chemical: Chemical,
        },
    ) {
        dialogRef.disableClose = true;

        const chemical = this.data.chemical

        this.dateAdapter.setLocale('en-GB');
        this.masterCheckbox = false;
        this.hazardCategoryList = allHazards().map(hazard => {
            return { name: hazard,
                     selected: chemical.hazards.includes(hazard)}
        })

        this.selectedHazardCategories = chemical.hazards

        this.form = this.fb.group({
            casNumber: new FormControl(chemical.casNumber, [Validators.pattern('\\b[1-9]{1}\\d{1,5}-\\d{2}-\\d\\b'), Validators.required]),
            name: new FormControl(chemical.name, Validators.required),
            chemicalNumber: new FormControl(chemical.chemicalNumber, Validators.required),
            matterState: new FormControl(chemical.matterState, Validators.required),
            quantity: new FormControl(chemical.quantity, Validators.required),
            added: new FormControl(chemical.added, Validators.required),
            expiry: new FormControl(chemical.expiry, Validators.required),
            safetyDataSheet: new FormControl(chemical.safetyDataSheet, Validators.required),
            coshhLink: new FormControl(chemical.coshhLink),
            storageTemp: new FormControl(chemical.storageTemp, Validators.required),
            location: new FormControl(chemical.location),
            cupboard: new FormControl(chemical.cupboard),
            hazards: this.buildHazards(chemical),
            projectSpecific: new UntypedFormControl(chemical.projectSpecific)
        })
    }

    projectSpecificOptions: Observable<string[]> = new Observable()

    ngOnInit(): void {
        this.projectSpecificOptions = getAutocompleteObservable(this.form.controls["projectSpecific"], this.data.projectSpecific)
    }

    buildHazards(chemical: Chemical) {
        const hazards = this.hazardCategoryList.map(hazard => this.fb.control(hazard.selected));

        return this.fb.array(hazards);
    }


    onClose(): void {
        const chemical = {...this.data.chemical,
                          ...this.form.value}
        chemical.hazards = this.selectedHazardCategories
        this.form.valid && this.dialogRef.close(chemical)
    }

    onCancel(): void {
        this.dialogRef.close()
    }

    removeHazardFromSelectedHazardList(hazardName: string): void {
        if (this.selectedHazardCategories.indexOf(hazardName) >= 0) {
            this.selectedHazardCategories.splice(this.selectedHazardCategories.indexOf(hazardName), 1)
        }
    }

    uncheckHazard(hazardName: string): void {
        const hazardNameIndex = this.hazardCategoryList
            .findIndex((hazardCategory: HazardCategory) => hazardCategory.name === hazardName)
        this.hazardCategoryList[hazardNameIndex].selected = false
    }

    removeHazard(hazardName: string): void {
        this.removeHazardFromSelectedHazardList(hazardName)
        this.uncheckHazard(hazardName)
    }

    onCheckboxChange(event: any, index: number): void {
        const changedCategory = this.hazardCategoryList[index]
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
                    this.removeHazard('None')
                    this.removeHazard('Unknown')
                    // add the hazard to selectedHazardCategories
                    this.selectedHazardCategories.push(changedCategory.name)
                    // set the selected property of the hazard to true in hazardCategoryList
                    this.hazardCategoryList[index].selected = true
            }
        } else {
            // remove the unchecked item from selectedHazardCategories
            this.selectedHazardCategories.splice(this.selectedHazardCategories.indexOf(changedCategory.name), 1)
            // set the selected property of the hazard to false in hazardCategoryList
            this.hazardCategoryList[index].selected = false
        }
    }
}




