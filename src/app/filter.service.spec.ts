import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FilterService } from './filter.service';
import {HttpClient} from "@angular/common/http";

import { defer } from 'rxjs';

/**
 * Create async observable that emits-once and completes
 * after a JS engine turn
 */
export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}


describe('FilterService', () => {
  let service: FilterService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let filterService: FilterService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('can return cupboards', (done: DoneFn) => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    filterService = new FilterService(httpClientSpy)
    const expectedCupboards = ['1', '2', '3']
    httpClientSpy.get.and.returnValue(asyncData(expectedCupboards));
    filterService.getCupboardsForLab("Lab 1").subscribe({
      next: cupboards => {
        expect(cupboards)
            .withContext('expected cupboards')
            .toEqual(expectedCupboards);
        done();
      },
      error: done.fail
    });
  });
});
