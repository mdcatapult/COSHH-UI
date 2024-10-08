/*
 * Copyright 2024 Medicines Discovery Catapult
 * Licensed under the Apache License, Version 2.0 (the "Licence");
 * you may not use this file except in compliance with the Licence.
 * You may obtain a copy of the Licence at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

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

    let data = {
                            labs: ['lab1', 'lab2'],
                            users: ['user1', 'user2'],
                            chemical: { hazards: null as string[] | null }
                    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChemicalDialogComponent],
            providers: [
                MatDialog,
                HttpClient,
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA,  useFactory: () => data } ,
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

    afterEach(() => {
                data = {  // Reset the data
                                labs: ['lab1', 'lab2'],
                               users: ['user1', 'user2'],
                                chemical: { hazards: null }
                        };
            });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should set hazards to ["Unknown"] if initial hazard is null', () => {
        expect(component.selectedHazardCategories).toEqual(['Unknown']);
    });
    it('should do something else if initial hazard is not null', () => {
        data.chemical.hazards = ['Hazard1', 'Hazard2']; // Modify data before creating component
                fixture = TestBed.createComponent(ChemicalDialogComponent);
                component = fixture.componentInstance;
                fixture.detectChanges();
        expect(component.selectedHazardCategories).toEqual(['Hazard1', 'Hazard2']);
    });
});
