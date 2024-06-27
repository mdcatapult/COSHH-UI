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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';

import { CloneChemicalComponent } from './clone-chemical.component';

describe('CloneChemicalComponent', () => {
    let component: CloneChemicalComponent;

    let fixture: ComponentFixture<CloneChemicalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CloneChemicalComponent],
            providers: [
                HttpClient,
                HttpHandler
            ],
            imports: [MatDialogModule]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CloneChemicalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
