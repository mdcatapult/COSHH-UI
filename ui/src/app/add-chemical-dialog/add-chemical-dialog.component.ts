import {Component, Inject, Input} from '@angular/core';
import {UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Chemical} from '../coshh/types';

@Component({
    selector: 'app-add-chemical-dialog',
    templateUrl: './add-chemical-dialog.component.html',
    styleUrls: ['./add-chemical-dialog.component.scss']
})
export class AddChemicalDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<AddChemicalDialogComponent>,
        private dateAdapter: DateAdapter<Date>,
        @Inject(MAT_DIALOG_DATA) public data: {labs: string[]},
    ) {
        this.dateAdapter.setLocale('en-GB');
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

    form = new UntypedFormGroup({
        casNumber: new UntypedFormControl('', [Validators.pattern('\\b[1-9]{1}\\d{1,5}-\\d{2}-\\d\\b'), Validators.required]),
        name: new UntypedFormControl('', Validators.required),
        photoPath: new UntypedFormControl('', Validators.required),
        matterState: new UntypedFormControl('', Validators.required),
        quantity: new UntypedFormControl('', Validators.required),
        added: new UntypedFormControl(new Date(), Validators.required),
        expiry: new UntypedFormControl(new Date(), Validators.required),
        safetyDataSheet: new UntypedFormControl('', Validators.required),
        coshhLink: new UntypedFormControl(''),
        storageTemp: new UntypedFormControl('', Validators.required),
        location: new UntypedFormControl(''),
        hazards: new UntypedFormArray(this.hazardCategories.map(() => new UntypedFormControl(false)), Validators.required)
    });

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
        console.log(this.selectedHazardCategories)
    }

}




