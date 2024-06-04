import { AuthModule } from '@auth0/auth0-angular';
import { ChemicalService } from './chemical.service';

import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ChemicalService', () => {
    let service: ChemicalService;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [
        // Fake Auth0 details for testing purposes
        AuthModule.forRoot({
            domain: 'a.domain.id',
            clientId: '12345'
        })],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
        service = TestBed.inject(ChemicalService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});