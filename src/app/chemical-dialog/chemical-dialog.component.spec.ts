import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';

import { ChemicalDialogComponent } from './chemical-dialog.component';

describe('ChemicalDialogComponent', () => {
    let component: ChemicalDialogComponent;

    let fixture: ComponentFixture<ChemicalDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChemicalDialogComponent],
            providers: [
                MatDialog,
                HttpClient,
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {
                    chemical: { hazards: null }
                } },
                DateAdapter
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
    it('should set hazards to ["Unknown"] if initial hazard is null', () => {
        expect(component.selectedHazardCategories).toEqual(['Unknown']);
    });
});
