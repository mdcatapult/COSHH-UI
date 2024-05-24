import { AuthModule } from '@auth0/auth0-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { TestBed } from '@angular/core/testing';

import { ChemicalService } from './chemical.service';
import { ScanningService } from './scanning.service';

describe('ScanningService', () => {
    let service: ScanningService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                MatDialogModule,
                // Fake Auth0 details for testing purposes
                AuthModule.forRoot({
                    domain: 'a.domain.id',
                    clientId: '12345'
                })
            ],
            providers: [ChemicalService]
        });
        service = TestBed.inject(ScanningService);
    });


        it('should be created', () => {
            expect(service).toBeTruthy();
        });
    });
