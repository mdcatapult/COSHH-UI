import {HttpClient} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DateAdapter} from '@angular/material/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import {ChemicalDialogComponent} from './chemical-dialog.component';
import {ReactiveFormsModule} from "@angular/forms";

describe('ChemicalDialogComponent', () => {
    let component: ChemicalDialogComponent;
    let fixture: ComponentFixture<ChemicalDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChemicalDialogComponent],
            providers: [
                MatDialog,
                HttpClient,
                {provide: MatDialogRef, useValue: {}},
                {provide: MAT_DIALOG_DATA, useValue: {
                    chemical: {hazards: []},
                }},
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
        fixture = TestBed.createComponent(ChemicalDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
