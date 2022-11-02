import {HttpClient} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DateAdapter} from '@angular/material/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import {AddChemicalDialogComponent} from './add-chemical-dialog.component';
import {ReactiveFormsModule} from "@angular/forms";

describe('AddChemicalDialogComponent', () => {
    let component: AddChemicalDialogComponent;
    let fixture: ComponentFixture<AddChemicalDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddChemicalDialogComponent],
            providers: [
                MatDialog,
                HttpClient,
                {provide: MatDialogRef, useValue: {}},
                {provide: MAT_DIALOG_DATA, useValue: {}},
                DateAdapter,
            ],
            imports: [
                MatAutocompleteModule,
                ReactiveFormsModule
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AddChemicalDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
