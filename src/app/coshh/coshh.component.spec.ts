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

import { AuthModule } from '@auth0/auth0-angular';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { UntypedFormBuilder } from '@angular/forms';

import { CoshhComponent } from './coshh.component';
import { HazardService } from '../services/hazard.service';
import { SaveService } from '../services/save.service';

describe('CoshhComponent', () => {
    let component: CoshhComponent;

    let fixture: ComponentFixture<CoshhComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CoshhComponent],
            providers: [
                HazardService,
                HttpClient,
                HttpHandler,
                SaveService,
                UntypedFormBuilder
            ],
            imports: [
                MatAutocompleteModule,
                MatDialogModule,
                MatMenuModule,
                // Fake Auth0 details for testing purposes
                AuthModule.forRoot({
                    domain: 'a.domain.id',
                    clientId: '12345'
                })
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CoshhComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
