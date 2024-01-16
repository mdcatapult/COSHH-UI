import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HazardService } from './hazard.service';

describe('HazardService', () => {
    let service: HazardService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(HazardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});