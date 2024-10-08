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

import { defer } from 'rxjs';
import { HttpClient, HttpParams, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Chemical } from '../coshh/types';
import { chemicalFive, chemicalFour, chemicalOne, chemicalThree, chemicalTwo } from '../../test-data/test-data';
import { DataService } from './data.service';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

/**
 * Create async observable that emits-once and completes
 * after a JS engine turn
 */
export function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
}

describe('DataService', () => {
    let service: DataService;

    let errorHandlerServiceSpy: jasmine.SpyObj<ErrorHandlerService>;

    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    let filterService: DataService;

    beforeEach(() => {

        errorHandlerServiceSpy = jasmine.createSpyObj('ErrorHandlerService', ['handleError']);

        TestBed.configureTestingModule({
            imports: [],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                { provide: ErrorHandlerService, useValue: errorHandlerServiceSpy }]
        });
        service = TestBed.inject(DataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });


    describe('getCupboardsForLab', () => {

        it('can return cupboards for a lab', (done: DoneFn) => {
            httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
            filterService = new DataService(errorHandlerServiceSpy, httpClientSpy);
            const expectedCupboards = ['1', '2', '3'];

            httpClientSpy.get.and.returnValue(asyncData(expectedCupboards));
            filterService.getCupboardsForLab('Lab 1').subscribe({
                next: (cupboards) => {
                    expect(cupboards)
                        .withContext('expected cupboards')
                        .toEqual(expectedCupboards);
                    done();
                },
                error: done.fail
            });
        });

        it('makes http request with the correct params', (done: DoneFn) => {
            httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
            filterService = new DataService(errorHandlerServiceSpy, httpClientSpy);
            const options =
                { params: new HttpParams().set('lab', 'Lab 1') };

            httpClientSpy.get.and.returnValue(asyncData(['1', '2', '3']));
            filterService.getCupboardsForLab('Lab 1').subscribe({
                next: () => {
                    expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.backendUrl}/cupboards`, options);
                    done();
                },
                error: done.fail
            });
        });
    });

    it('can return an empty list if no results', (done: DoneFn) => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        filterService = new DataService(errorHandlerServiceSpy, httpClientSpy);
        const expectedCupboards: string[] = [];

        httpClientSpy.get.and.returnValue(asyncData(expectedCupboards));
        filterService.getCupboardsForLab('Lab 1').subscribe({
            next: (cupboards) => {
                expect(cupboards)
                    .withContext('expected cupboards')
                    .toEqual(expectedCupboards);
                done();
            },
            error: done.fail
        });
    });


    describe('getCupboards', () => {

        it('can return cupboards', (done: DoneFn) => {
            httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
            filterService = new DataService(errorHandlerServiceSpy, httpClientSpy);
            const expectedCupboards = ['1', '2', '3'];

            httpClientSpy.get.and.returnValue(asyncData(expectedCupboards));
            filterService.getCupboards().subscribe({
                next: (cupboards) => {
                    expect(cupboards)
                        .withContext('expected cupboards')
                        .toEqual(expectedCupboards);
                    done();
                },
                error: done.fail
            });
        });

        it('can return an empty list if no results', (done: DoneFn) => {
            httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
            filterService = new DataService(errorHandlerServiceSpy, httpClientSpy);
            const expectedCupboards: string[] = [];

            httpClientSpy.get.and.returnValue(asyncData(expectedCupboards));
            filterService.getCupboards().subscribe({
                next: (cupboards) => {
                    expect(cupboards)
                        .withContext('expected cupboards')
                        .toEqual(expectedCupboards);
                    done();
                },
                error: done.fail
            });
        });
    });


    describe('getLabs', () => {

        it('can return labs', (done: DoneFn) => {
            httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
            filterService = new DataService(errorHandlerServiceSpy, httpClientSpy);
            const expectedLabs = ['Lab 1', 'Lab 2', 'Lab 3'];

            httpClientSpy.get.and.returnValue(asyncData(expectedLabs));
            filterService.getLabs().subscribe({
                next: (labs) => {
                    expect(labs)
                        .withContext('expected labs')
                        .toEqual(expectedLabs);
                    done();
                },
                error: done.fail
            });
        });

        it('can return an empty list if no results', (done: DoneFn) => {
            httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
            filterService = new DataService(errorHandlerServiceSpy, httpClientSpy);
            const expectedLabs: string[] = [];

            httpClientSpy.get.and.returnValue(asyncData(expectedLabs));
            filterService.getLabs().subscribe({
                next: (labs) => {
                    expect(labs)
                        .withContext('expected labs')
                        .toEqual(expectedLabs);
                    done();
                },
                error: done.fail
            });
        });
    });


    describe('getChemicals', () => {

        it('can return chemicals', (done: DoneFn) => {
            httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
            filterService = new DataService(errorHandlerServiceSpy, httpClientSpy);
            const expectedChemicals: Chemical[] = [chemicalOne];

            httpClientSpy.get.and.returnValue(asyncData(expectedChemicals));
            filterService.getChemicals().subscribe({
                next: (chemicals) => {
                    expect(chemicals)
                        .withContext('expected chemicals')
                        .toEqual(expectedChemicals);
                    done();
                },
                error: done.fail
            });
        });

        it('can return an empty list if no results', (done: DoneFn) => {
            httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
            filterService = new DataService(errorHandlerServiceSpy, httpClientSpy);
            const expectedChemicals: Chemical[] = [];

            httpClientSpy.get.and.returnValue(asyncData(expectedChemicals));
            filterService.getChemicals().subscribe({
                next: (chemicals) => {
                    expect(chemicals)
                        .withContext('expected chemicals')
                        .toEqual(expectedChemicals);
                    done();
                },
                error: done.fail
            });
        });
    });

    describe('getOwners', () => {

        it('can return owners', () => {
            const chemicals: Chemical[] = [chemicalOne];

            const expectedOwners = ['Owner 1'];

            expect(service.getOwners(chemicals, '')).toEqual(expectedOwners);
        });

        it('returns sorted list', () => {
            const chemicals: Chemical[] = [chemicalTwo, chemicalOne];

            const expectedOwners = ['Owner 1', 'Owner 2'];

            expect(service.getOwners(chemicals, '')).toEqual(expectedOwners);
            expect(service.getOwners(chemicals, '')).not.toEqual(expectedOwners.reverse());
        });

        it('return value doesn`t include duplicates', () => {
            const chemicals: Chemical[] = [chemicalOne, chemicalTwo, chemicalThree];

            const expectedOwners = ['Owner 1', 'Owner 2'];

            expect(service.getOwners(chemicals, '')).toEqual(expectedOwners);
        });

        it('can handle missing owners', () => {
            const chemicals: Chemical[] = [chemicalFive];

            const expectedOwners = [''];

            expect(service.getOwners(chemicals, '')).toEqual(expectedOwners);
        });

    });

    describe('getNames', () => {

        it('can return names and numbers', () => {
            const chemicals: Chemical[] = [chemicalOne];

            const expectedNamesAndNumbers = ['1', 'Chemical 1'];

            expect(service.getNamesAndNumbers(chemicals, '')).toEqual(expectedNamesAndNumbers);
        });

        it('returns sorted list', () => {
            const chemicals: Chemical[] = [chemicalTwo, chemicalOne, chemicalThree];

            const expectedNamesAndNumbers = ['1', '2','3', 'Chemical 1', 'Chemical 2', 'Chemical 3'];

            expect(service.getNamesAndNumbers(chemicals, '')).toEqual(expectedNamesAndNumbers);
        });

        it('return value doesn`t include duplicates', () => {
            const chemicals: Chemical[] = [chemicalOne, chemicalTwo, chemicalThree, chemicalFour];

            const expectedNamesAndNumbers = ['1', '2', '3', 'Chemical 1', 'Chemical 2', 'Chemical 3'];

            expect(service.getNamesAndNumbers(chemicals, '')).toEqual(expectedNamesAndNumbers);
        });

        it('can handle missing chemical numbers', () => {
            const chemicals: Chemical[] = [chemicalFive];

            const expectedNamesAndNumbers = ['', 'Chemical 5'];

            expect(service.getNamesAndNumbers(chemicals, '')).toEqual(expectedNamesAndNumbers);
        });

    });

});
