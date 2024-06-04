import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HazardService } from './hazard.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('HazardService', () => {
    let service: HazardService;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
        service = TestBed.inject(HazardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});