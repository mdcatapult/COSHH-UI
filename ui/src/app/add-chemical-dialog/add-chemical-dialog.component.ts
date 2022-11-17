import {Component, Inject} from '@angular/core';
import {Validators, FormControl, UntypedFormControl, FormBuilder} from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment';
import {Observable} from "rxjs";
import {getAutocompleteObservable} from "../utility/utilities";
import {HazardCategory} from "../coshh/types"

@Component({
    selector: 'app-add-chemical-dialog',
    templateUrl: './add-chemical-dialog.component.html',
    styleUrls: ['./add-chemical-dialog.component.scss']
})
export class AddChemicalDialogComponent {

    hazardCategoryList: HazardCategory[]
    masterCheckbox: boolean
    form: any

    constructor(
        public dialogRef: MatDialogRef<AddChemicalDialogComponent>,
        private dateAdapter: DateAdapter<Date>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: {
            labs: string[],
            projectSpecific: string[]
        },
    ) {
        this.dateAdapter.setLocale('en-GB');
        this.masterCheckbox = false;
        this.hazardCategoryList = [
            {name: 'None', selected: true},
            {name: 'Unknown', selected: false},
            {name: 'Explosive', selected: false},
            {name: 'Flammable', selected: false},
            {name: 'Oxidising', selected: false},
            {name: 'Corrosive', selected: false},
            {name: 'Acute toxicity', selected: false},
            {name: 'Hazardous to the environment', selected: false},
            {name: 'Health hazard/Hazardous to the ozone layer', selected: false},
            {name: 'Serious health hazard', selected: false},
            {name: 'Gas under pressure', selected: false}
        ]

        this.form = this.fb.group({
            casNumber: new FormControl('', [Validators.pattern('\\b[1-9]{1}\\d{1,5}-\\d{2}-\\d\\b'), Validators.required]),
            name: new FormControl('', Validators.required),
            chemicalNumber: new FormControl('', Validators.required),
            matterState: new FormControl('', Validators.required),
            quantity: new FormControl('', Validators.required),
            added: new FormControl(moment(new Date(), "DD-MM-YYY"), Validators.required),
            expiry: new FormControl(moment(new Date(), "DD-MM-YYY").add(5, 'y'), Validators.required),
            safetyDataSheet: new FormControl('', Validators.required),
            coshhLink: new FormControl(''),
            storageTemp: new FormControl('', Validators.required),
            location: new FormControl(''),
            cupboard: new FormControl(''),
            hazards: this.buildHazards(),
            projectSpecific: new UntypedFormControl('')
        })
    }

    projectSpecificOptions: Observable<string[]> = new Observable()

    ngOnInit(): void {
        this.projectSpecificOptions = getAutocompleteObservable(this.form.controls["projectSpecific"], this.data.projectSpecific)
    }

    buildHazards() {
        const hazards = this.hazardCategoryList.map(hazard => this.fb.control(hazard.selected));

        return this.fb.array(hazards);
    }

    selectedHazardCategories: string[] = ['None']

    onClose(): void {
        const chemical = this.form.value
        chemical.hazards = this.selectedHazardCategories
        this.form.valid && this.dialogRef.close(chemical)
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




