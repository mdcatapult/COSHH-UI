import {Component, Inject, Input} from '@angular/core';
import {FormGroup, Validators, FormControl, FormArray, UntypedFormControl} from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment';
import {map, Observable} from "rxjs";
import {getAutocompleteObservable} from "../utility/utilities";

@Component({
    selector: 'app-add-chemical-dialog',
    templateUrl: './add-chemical-dialog.component.html',
    styleUrls: ['./add-chemical-dialog.component.scss']
})
export class AddChemicalDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<AddChemicalDialogComponent>,
        private dateAdapter: DateAdapter<Date>,
        @Inject(MAT_DIALOG_DATA) public data: {
            labs: string[],
            projectCodes: string[],
            projectNames: string[]
        },
    ) {
        this.dateAdapter.setLocale('en-GB');
    }

    projectNamesOptions: Observable<string[]> = new Observable()
    projectNamesControl = new UntypedFormControl()

    ngOnInit(): void {
        this.projectNamesOptions = getAutocompleteObservable(this.projectNamesControl, this.data.projectNames)
    }

    hazardCategories = [
        'Explosive',
        'Flammable',
        'Oxidising',
        'Corrosive',
        'Acute toxicity',
        'Hazardous to the environment',
        'Health hazard/Hazardous to the ozone layer',
        'Serious health hazard',
        'Gas under pressure'
    ]

    selectedHazardCategories: string[] = []

    form = new FormGroup({
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
        hazards: new FormArray(this.hazardCategories.map(() => new FormControl('')), Validators.required),
        projectCode: new FormControl(''),
        projectName: new FormControl('')
    })

    onClose(): void {
        const chemical = this.form.value
        chemical.hazards = this.selectedHazardCategories
        this.form.valid && this.dialogRef.close(chemical)
    }

    onCheckboxChange(event: any, index: number): void {
        const changedCategory = this.hazardCategories[index]
        if (event.checked) {
            this.selectedHazardCategories.push(changedCategory)
        } else {
            this.selectedHazardCategories.splice(this.selectedHazardCategories.indexOf(changedCategory))
        }
    }

}




