import { AuthModule } from '@auth0/auth0-angular';
import { SaveService } from './save.service';

import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChemicalService } from './chemical.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SaveService', () => {
    let service: SaveService;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [
        // Fake Auth0 details for testing purposes
        AuthModule.forRoot({
            domain: 'a.domain.id',
            clientId: '12345'
        })],
    providers: [ChemicalService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
        service = TestBed.inject(SaveService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});