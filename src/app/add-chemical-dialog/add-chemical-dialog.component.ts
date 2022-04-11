import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chemical } from '../coshh/types';

@Component({
  selector: 'app-add-chemical-dialog',
  templateUrl: './add-chemical-dialog.component.html',
  styleUrls: ['./add-chemical-dialog.component.sass']
})
export class AddChemicalDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AddChemicalDialogComponent>,
    private dateAdapter: DateAdapter<Date>,
    @Inject(MAT_DIALOG_DATA) public data: Chemical,
  ) {
    this.dateAdapter.setLocale('en-GB'); 
  }

  form = new FormGroup({
    casNumber: new FormControl('', [Validators.pattern('\\b[1-9]{1}\\d{1,5}-\\d{2}-\\d\\b'), Validators.required]),
    chemicalName: new FormControl('', Validators.required),
    photoPath: new FormControl('', Validators.required),
    matterState: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    added: new FormControl(''),
    expiry: new FormControl(''),
    safetyDataSheet: new FormControl('', Validators.required),
    coshhLink: new FormControl(''),
    storageTemp: new FormControl('', Validators.required),
    location: new FormControl(''),
  });

  onClose(): void {
    this.form.valid && this.dialogRef.close(this.form.value)
  }

}




