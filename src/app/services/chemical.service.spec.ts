import { AuthModule } from '@auth0/auth0-angular';
import { ChemicalService } from './chemical.service';

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChemicalService', () => {
    let service: ChemicalService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                // Fake Auth0 details for testing purposes
                AuthModule.forRoot({
                    domain: 'a.domain.id',
                    clientId: '12345'
                })
            ]
        });
        service = TestBed.inject(ChemicalService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});