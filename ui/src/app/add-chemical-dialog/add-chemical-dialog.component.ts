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
            {id: 0, name: 'None', selected: true},
            {id: 1, name: 'Unknown', selected: false},
            {id: 2, name: 'Explosive', selected: false},
            {id: 3, name: 'Flammable', selected: false},
            {id: 4, name: 'Oxidising', selected: false},
            {id: 5, name: 'Corrosive', selected: false},
            {id: 7, name: 'Acute toxicity', selected: false},
            {id: 8, name: 'Hazardous to the environment', selected: false},
            {id: 9, name: 'Health hazard/Hazardous to the ozone layer', selected: false},
            {id: 10, name: 'Serious health hazard', selected: false},
            {id: 11, name: 'Gas under pressure', selected: false}
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
                    this.selectedHazardCategories = [`${changedCategory.name}`];
                    break;
                default:
                    // remove default 'None' value from selectedHazardCategories if present
                    if (this.selectedHazardCategories.indexOf('None') >= 0) {
                        this.selectedHazardCategories.splice(this.selectedHazardCategories.indexOf('None'), 1)
                    }
                    this.selectedHazardCategories.push(changedCategory.name)
                    // uncheck 'None'
                    const noneIndex = this.hazardCategoryList
                        .findIndex((hazardCategory: HazardCategory) => hazardCategory.name === 'None')
                    this.hazardCategoryList[noneIndex].selected = false
                    this.hazardCategoryList[index].selected = true
            }
        } else {
            // A box has been unchecked
            this.selectedHazardCategories.splice(this.selectedHazardCategories.indexOf(changedCategory.name), 1)
            this.hazardCategoryList[index].selected = false
        }
    }
}




