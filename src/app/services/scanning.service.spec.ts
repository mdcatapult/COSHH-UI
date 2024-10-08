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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { chemicalOne } from '../../test-data/test-data';
import { ChemicalService } from './chemical.service';
import { ScanningService } from './scanning.service';

describe('ScanningService', () => {
    let chemicalService: ChemicalService;

    let dialog: MatDialog;

    let service: ScanningService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule,
                // Fake Auth0 details for testing purposes
                AuthModule.forRoot({
                    domain: 'a.domain.id',
                    clientId: '12345'
                })],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                {
                    provide: ChemicalService,
                    useValue: jasmine.createSpyObj('ChemicalService', ['getAllChemicals'])
                }
            ]
        });
        service = TestBed.inject(ScanningService);
        chemicalService = TestBed.inject(ChemicalService);
        dialog = TestBed.inject(MatDialog);
    });


    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('onDialogOpen', () => {
        it('should set dialogOpen and scanningMode correctly', () => {
            service.onDialogOpen(true);
            expect(service.dialogOpen).toBeTrue();
            expect(service.scanningMode).toBeFalse();

            service.onDialogOpen(false);
            expect(service.dialogOpen).toBeFalse();
            expect(service.scanningMode).toBeTrue();
        });
    });

    describe('barcodeScanned', () => {
        beforeEach(() => {
            (chemicalService.getAllChemicals as jasmine.Spy).and.returnValue([
                chemicalOne
            ]);
        });

        it('should open the dialog with correct parameters when dialogOpen is false', () => {
            const dialogSpy = spyOn(dialog, 'open').and.callThrough();

            service.dialogOpen = false;
            service.scannedBarcode = '1';
            service.barcodeScanned();
            expect(dialogSpy).toHaveBeenCalled();
        });

        it('should not open the dialog when dialogOpen is true', () => {
            const dialogSpy = spyOn(dialog, 'open').and.callThrough();

            service.dialogOpen = true;
            service.barcodeScanned();
            expect(dialogSpy).not.toHaveBeenCalled();
        });
    });

});
