import {Component, Inject} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
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
        @Inject(MAT_DIALOG_DATA) public data: Chemical,
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
        'Health hazard',
        'Serious health hazard',
        'Gas under pressure'
    ]

    selectedHazardCategories: string[] = []

    form = new FormGroup({
        casNumber: new FormControl('', [Validators.pattern('\\b[1-9]{1}\\d{1,5}-\\d{2}-\\d\\b'), Validators.required]),
        name: new FormControl('', Validators.required),
        photoPath: new FormControl('', Validators.required),
        matterState: new FormControl('', Validators.required),
        quantity: new FormControl('', Validators.required),
        added: new FormControl(new Date(), Validators.required),
        expiry: new FormControl(new Date(), Validators.required),
        safetyDataSheet: new FormControl('', Validators.required),
        coshhLink: new FormControl(''),
        storageTemp: new FormControl('', Validators.required),
        location: new FormControl(''),
        hazards: new FormArray(this.hazardCategories.map(() => new FormControl(false)), Validators.required)
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




