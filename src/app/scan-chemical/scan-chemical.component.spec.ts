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

import { ScanChemicalComponent } from './scan-chemical.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ScanChemicalComponent', () => {
  let component: ScanChemicalComponent;

  let fixture: ComponentFixture<ScanChemicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanChemicalComponent ],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: MAT_DIALOG_DATA, useValue: {
            chemical: { hazards: [] }
          } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanChemicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
