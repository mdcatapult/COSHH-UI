import { environment } from "../../environments/environment";
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import moment from 'moment';

import { asyncData } from "./data.service.spec";
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {Chemical, HazardListItem} from '../coshh/types';
import { HazardService } from './hazard.service';

describe('HazardService', () => {
    let service: HazardService;

    let httpClientSpy: jasmine.SpyObj<HttpClient>;

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

            const chemical: Chemical = {
                    id: 0,
                    casNumber: '',
                    name: '',
                    chemicalNumber: '',
                    matterState: 'solid',
                    quantity: '',
                    added: moment(),
                    expiry: moment(),
                    safetyDataSheet: '',
                    coshhLink: '',
                    storageTemp: 'Shelf',
                    location: '',
                    cupboard: '',
                    isArchived: false,
                    owner: '',
                    hazards: [],
                    hazardList: [],
                    backgroundColour: '',
                    lastUpdatedBy: ''
                };

            httpClientSpy.put.and.returnValue(asyncData([]));
            service.updateHazards(chemical);

            expect(httpClientSpy.put).toHaveBeenCalledWith(`${environment.backendUrl}/hazards`, chemical);
        });

        it('should call getHazardListForChemical with the correct chemical', fakeAsync(() => {

            const chemical: Chemical = {
                id: 0,
                casNumber: '',
                name: '',
                chemicalNumber: '',
                matterState: 'solid',
                quantity: '',
                added: moment(),
                expiry: moment(),
                safetyDataSheet: '',
                coshhLink: '',
                storageTemp: 'Shelf',
                location: '',
                cupboard: '',
                isArchived: false,
                owner: '',
                hazards: ['Explosive'],
                hazardList: [],
                backgroundColour: '',
                lastUpdatedBy: ''
            };

            httpClientSpy.put.and.returnValue(asyncData([]));
            service.updateHazards(chemical);
            tick();
            spyOn(service, 'getHazardListForChemical').and.callThrough();

            const expected: HazardListItem[] = [
                { title: 'None', activated: false, value: 'None' },
                { title: 'Unknown', activated: false, value: 'Unknown'},
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

            expect(chemical.hazardList.sort()).toEqual(expected.sort());
        }));

    });
});