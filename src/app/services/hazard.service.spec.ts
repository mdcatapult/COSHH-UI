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

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { asyncData } from './data.service.spec';
import { chemicalOne } from '../../test-data/test-data';
import { environment } from '../../environments/environment';
import { HazardListItem } from '../coshh/types';
import { HazardService } from './hazard.service';

describe('HazardService', () => {
    let service: HazardService;

    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    const expectedHazardItemList: HazardListItem[] = [
        { title: 'None', activated: false, value: 'None' },
        { title: 'Unknown', activated: false, value: 'Unknown' },
        { title: 'Explosive', activated: true, value: 'Explosive' },
        { title: 'Flammable', activated: false, value: 'Flammable' },
        { title: 'Oxidising', activated: false, value: 'Oxidising' },
        { title: 'Corrosive', activated: false, value: 'Corrosive' },
        { title: 'Acute toxicity', activated: false, value: 'Acute toxicity' },
        { title: 'Hazardous to the environment', activated: false, value: 'Hazardous to the environment' },
        { title: 'Health hazard/Hazardous to the ozone layer', activated: false, value: 'Health hazard/Hazardous to the ozone layer' },
        { title: 'Serious health hazard', activated: false, value: 'Serious health hazard' },
        { title: 'Gas under pressure', activated: false, value: 'Gas under pressure' }
    ];

    beforeEach(() => {
        const httpClientSpyObj = jasmine.createSpyObj('HttpClient', ['put']);


        TestBed.configureTestingModule({
            imports: [],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                {
                    provide: HttpClient,
                    useValue: httpClientSpyObj
                }
            ]
        });

        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
        service = TestBed.inject(HazardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getHazardPicture', () => {

        it('should return the correct image path for a corrosive hazard', () => {

            expect(service.getHazardPicture('Corrosive')).toBe('assets/corrosive.jpg');
        });

        it('should return the correct image path for a hazardous to the environment hazard', () => {

            expect(service.getHazardPicture('Hazardous to the environment')).toBe('assets/environment.jpg');
        });

        it('should return the correct image path for an explosive hazard', () => {

            expect(service.getHazardPicture('Explosive')).toBe('assets/explosive.jpg');
        });

        it('should return the correct image path for a flammable hazard', () => {

            expect(service.getHazardPicture('Flammable')).toBe('assets/flammable.jpg');
        });

        it('should return the correct image path for a gas under pressure hazard', () => {

            expect(service.getHazardPicture('Gas under pressure')).toBe('assets/gas.jpg');
        });

        it('should return the correct image path for a health hazard/hazardous to the ozone layer hazard', () => {

            expect(service.getHazardPicture('Health hazard/Hazardous to the ozone layer')).toBe('assets/health.jpg');
        });

        it('should return the correct image path for an oxidising hazard', () => {

            expect(service.getHazardPicture('Oxidising')).toBe('assets/oxidising.jpg');
        });

        it('should return the correct image path for a serious health hazard hazard', () => {

            expect(service.getHazardPicture('Serious health hazard')).toBe('assets/serious.jpg');
        });

        it('should return the correct image path for an acute toxicity hazard', () => {

            expect(service.getHazardPicture('Acute toxicity')).toBe('assets/toxic.jpg');
        });

        it('should return the correct image path for a \'None\' hazard', () => {

            expect(service.getHazardPicture('None')).toBe('assets/non-hazardous.jpg');
        });

        it('should return the correct image path for an unknown hazard', () => {

            expect(service.getHazardPicture('Unknown')).toBe('assets/unknown.jpg');
        });
    });

    describe('updateHazards', () => {

        it('should call the http client put method with the correct url and chemical', () => {

            httpClientSpy.put.and.returnValue(asyncData([]));
            service.updateHazards(chemicalOne);

            expect(httpClientSpy.put).toHaveBeenCalledWith(`${environment.backendUrl}/hazards`, chemicalOne);
        });

        it('should call getHazardListForChemical with the correct chemical', fakeAsync(() => {

            httpClientSpy.put.and.returnValue(asyncData([]));
            service.updateHazards(chemicalOne);
            tick();
            spyOn(service, 'getHazardListForChemical').and.callThrough();

            expect(chemicalOne.hazardList.sort()).toEqual(expectedHazardItemList.sort());
        }));

    });

    describe('getHazardListForChemical', () => {

        it('should return a list of hazard list items for a given chemical', () => {

            expect(service.getHazardListForChemical(chemicalOne).sort()).toEqual(expectedHazardItemList.sort());
        });
    });
});