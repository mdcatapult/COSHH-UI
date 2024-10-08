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

import { asyncData } from './data.service.spec';
import { AuthModule } from '@auth0/auth0-angular';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MockProvider } from 'ng-mocks';
import { map, of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import {
    allChemicals,
    archivedChemical, chemicalFour,
    chemicalOne,
    chemicalThree,
    chemicalTwo,
    newChemical,
    updatedChemical
} from '../../test-data/test-data';
import { ChemicalService } from './chemical.service';
import { DataService } from './data.service';
import { environment } from '../../environments/environment';
import { Chemical } from '../coshh/types';
import { HazardService } from './hazard.service';
import { ExpiryService } from './expiry.service';
import { ErrorHandlerService } from './error-handler.service';

jasmine.getEnv().configure({ random: false });

describe('ChemicalService', () => {

    let chemicalService: ChemicalService;

    let dataService: jasmine.SpyObj<DataService>;

    let errorHandlerService: jasmine.SpyObj<ErrorHandlerService>;

    let expiryService: jasmine.SpyObj<ExpiryService>;

    let hazardService: jasmine.SpyObj<HazardService>;

    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        const httpClientSpyObj = jasmine.createSpyObj('HttpClient', ['post', 'put']);

        TestBed.configureTestingModule({
            imports: [
                // Fake Auth0 details for testing purposes
                AuthModule.forRoot({
                    domain: 'a.domain.id',
                    clientId: '12345'
                })],
            providers: [
                ChemicalService,
                MockProvider(DataService, {
                    getChemicals: jasmine.createSpy('getChemicals').and.returnValue(of(allChemicals)),
                    getLabs: jasmine.createSpy('getLabs').and.returnValue(of(['Lab 1', 'Lab 2', 'Lab 3'])),
                    getCupboards: jasmine.createSpy('getCupboards').and.returnValue(of(['Cupboard 1', 'cupboard 1', 'Cupboard 2', 'Cupboard 3'])),
                    getCupboardsForLab: jasmine.createSpy('getCupboardsForLab').and.returnValue(of(['Cupboard 2']))
                }),
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                {
                    provide: HttpClient,
                    useValue: httpClientSpyObj
                }
            ]
        }).compileComponents();

        chemicalService = TestBed.inject(ChemicalService);
        dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
        errorHandlerService = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;
        expiryService = TestBed.inject(ExpiryService) as jasmine.SpyObj<ExpiryService>;
        hazardService = TestBed.inject(HazardService) as jasmine.SpyObj<HazardService>;
        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    });

    it('should be created', () => {

        expect(chemicalService).toBeTruthy();
    });

    it('should get chemicals from the data service on initialisation', () => {

        expect(dataService.getChemicals).toHaveBeenCalled();
    });

    it('should set chemicals in state on initialisation', () => {

        expect(chemicalService.getAllChemicals()).toEqual(allChemicals);
    });

    it('should filter chemicals when lab filter is applied', () => {
        chemicalService.labFilterControl.setValue('Lab 1');

        expect(chemicalService.getFilteredChemicals()).toEqual([chemicalOne]);
    });

    it('should filter chemicals when cupboard filter is applied', () => {
        chemicalService.cupboardFilterControl.setValue('cupboard 3');

        expect(chemicalService.getFilteredChemicals()).toEqual([chemicalThree]);
    });

    it('filteredChemicals should not include archived chemicals by default', () => {

        expect(chemicalService.getFilteredChemicals().includes(archivedChemical)).toEqual(false);
    });

    it('filtered chemicals should include archived chemicals when archive filter is toggled on', () => {
        chemicalService.toggleArchiveControl.setValue(true);

        expect(chemicalService.getFilteredChemicals().includes(archivedChemical)).toEqual(true);
    });

    it('should filter chemicals when hazard filter is applied', () => {
        chemicalService.hazardFilterControl.setValue('Explosive');

        expect(chemicalService.getFilteredChemicals()).toEqual([chemicalOne]);
    });

    it('should filter chemicals when expiry filter is applied', () => {
        chemicalService.expiryFilterControl.setValue('< 30 Days');

        expect(chemicalService.getFilteredChemicals()).toEqual([chemicalTwo]);
    });

    it('should filter chemicals with search string', () => {
        chemicalService.nameOrNumberSearchControl.setValue('1');

        expect(chemicalService.getFilteredChemicals()).toEqual([chemicalOne]);
    });

    it('should get labs from the data service on initialisation', () => {

        expect(dataService.getLabs).toHaveBeenCalled();
    });

    it('should set labs in state on initialisation and add \'All\' to the array', () => {

        expect(chemicalService.labFilterValues.sort()).toEqual(['All', 'Lab 1', 'Lab 2', 'Lab 3'].sort());
    });

    it('should get cupboards from the data service on initialisation', () => {

        expect(dataService.getCupboards).toHaveBeenCalled();
    });

    it('should lowercase and set cupboards in state on initialisation and add \'All\' to the array', () => {

        expect(chemicalService.cupboardFilterValues.sort()).toEqual(['All', 'cupboard 1', 'cupboard 2', 'cupboard 3'].sort());
    });

    it('should call getCupboardsForLab when a lab is selected', () => {
        chemicalService.labFilterControl.setValue('Lab 1');

        expect(dataService.getCupboardsForLab).toHaveBeenCalledWith('Lab 1');
    });

    it('should update cupboard filter options when a lab is selected', () => {
        chemicalService.labFilterControl.setValue('Lab 1');

        expect(chemicalService.cupboardFilterValues.sort()).toEqual(['All', 'cupboard 2'].sort());
    });

    describe('onChemicalAdded', () => {

        it('should add the new chemical to allChemicals', fakeAsync(() => {
            httpClientSpy.post.and.returnValue(asyncData(newChemical));
            chemicalService.onChemicalAdded(newChemical);
            spyOn(chemicalService, 'setAllChemicals').and.callThrough();
            tick();

            expect(chemicalService.getAllChemicals().includes(newChemical)).toEqual(true);
        }));

        it('should add the new chemical to filteredChemicals if it matches the current filters', fakeAsync(() => {
            httpClientSpy.post.and.returnValue(asyncData(newChemical));
            chemicalService.onChemicalAdded(newChemical);
            spyOn(chemicalService, 'setFilteredChemicals').and.callThrough();
            tick();

            expect(chemicalService.getFilteredChemicals().includes(newChemical)).toEqual(true);
        }));

        it('should not add the new chemical to filteredChemicals if it does not match the current filters', fakeAsync(() => {
            chemicalService.hazardFilterControl.setValue('Explosive');
            httpClientSpy.post.and.returnValue(asyncData(newChemical));
            chemicalService.onChemicalAdded(newChemical);
            spyOn(chemicalService, 'setFilteredChemicals').and.callThrough();
            tick();

            expect(chemicalService.getFilteredChemicals().includes(newChemical)).toEqual(false);
        }));

        it('should get hazard list for the new chemical', fakeAsync(() => {
            const hazardListSpy = spyOn(hazardService, 'getHazardListForChemical').and.callThrough();

            httpClientSpy.post.and.returnValue(asyncData(newChemical));
            chemicalService.onChemicalAdded(newChemical);
            tick();

            expect(hazardListSpy).toHaveBeenCalledWith(newChemical);
        }));

        it('should get expiryColour for the new chemical', fakeAsync(() => {
            const expiryColourSpy = spyOn(expiryService, 'getExpiryColour').and.callThrough();

            httpClientSpy.post.and.returnValue(asyncData(newChemical));
            chemicalService.onChemicalAdded(newChemical);
            tick();

            expect(expiryColourSpy).toHaveBeenCalledWith(newChemical);
        }));

        it('should format the cupboard name for the new chemical', () => {
            httpClientSpy.post.and.returnValue(asyncData(newChemical));
            chemicalService.onChemicalAdded(newChemical);

            expect(newChemical.cupboard).toEqual('cupboard 99');
        });

        it('should make a POST request to the API to add the new chemical', () => {
            httpClientSpy.post.and.returnValue(asyncData(newChemical));
            chemicalService.onChemicalAdded(newChemical);

            expect(httpClientSpy.post).toHaveBeenCalledTimes(1);

            expect(httpClientSpy.post).toHaveBeenCalledWith(`${environment.backendUrl}/chemical`, newChemical);
        });

        it('should set success message in state if the request is successful', fakeAsync(() => {
            httpClientSpy.post.and.returnValue(asyncData(newChemical));
            chemicalService.onChemicalAdded(newChemical);
            tick();

            expect(errorHandlerService.successMessage$.getValue()).toEqual(`${newChemical.name} was successfully added`);
        }));

        it('should update the error message in state if the request fails', fakeAsync(() => {
            httpClientSpy.post.and.returnValue(
                of({}).pipe(map(() => {
                        throw new HttpErrorResponse(
                            {
                                status: 500,
                                error: {
                                    message: 'Internal Server Error'
                                },
                                statusText: 'Oh Dear!'
                            }
                        );
                    }
                ))
            );

            const errorMessageSpy = spyOn(errorHandlerService, 'handleError').and.callThrough();

            chemicalService.onChemicalAdded(newChemical);
            tick();

            expect(errorMessageSpy).toHaveBeenCalled();
            expect(errorHandlerService.errorMessage$.getValue()).toEqual('Http failure response for (unknown url): 500 Oh Dear!');
        }));
    });

    describe('onChemicalEdited', () => {

        it('should call updateChemical and updateHazards', () => {
            spyOn(chemicalService, 'updateChemical').and.returnValue(of(updatedChemical));
            spyOn(hazardService, 'updateHazards').and.callThrough();
            httpClientSpy.put.and.returnValue(asyncData([]));

            chemicalService.onChemicalEdited(updatedChemical);

            expect(chemicalService.updateChemical).toHaveBeenCalledWith(updatedChemical);
            expect(hazardService.updateHazards).toHaveBeenCalledWith(updatedChemical);
        });

        it('should get hazard list for updated chemical', fakeAsync(() => {
            const hazardListSpy = spyOn(hazardService, 'getHazardListForChemical').and.callThrough();

            httpClientSpy.put.and.returnValue(asyncData([]));
            chemicalService.onChemicalEdited(updatedChemical);
            tick();

            expect(hazardListSpy).toHaveBeenCalledWith(updatedChemical);
        }));

        it('should get expiryColour for updated chemical', fakeAsync(() => {
            const expiryColourSpy = spyOn(expiryService, 'getExpiryColour').and.callThrough();

            httpClientSpy.put.and.returnValue(asyncData([]));
            chemicalService.onChemicalEdited(updatedChemical);
            tick();

            expect(expiryColourSpy).toHaveBeenCalledWith(updatedChemical);
        }));

        it('should call updateChemical', () => {
            spyOn(chemicalService, 'updateChemical').and.callThrough();
            httpClientSpy.put.and.returnValue(asyncData(updatedChemical));
            chemicalService.onChemicalEdited(updatedChemical);

            expect(chemicalService.updateChemical).toHaveBeenCalled();
        });

        it('should call updateHazards', fakeAsync(() => {
            spyOn(chemicalService, 'updateChemical').and.callThrough();
            const updateHazardsSpy = spyOn(hazardService, 'updateHazards').and.callThrough();

            httpClientSpy.put.and.returnValue(asyncData([]));
            chemicalService.onChemicalEdited(updatedChemical);

            chemicalService.updateChemical(updatedChemical).subscribe({
                next: (updatedChemical) => {

                    expect(updateHazardsSpy).toHaveBeenCalledWith(updatedChemical);
                }
            });
        }));

        it('should success message in state if the request is successful', fakeAsync(() => {
            httpClientSpy.put.and.returnValue(asyncData(updatedChemical));
            chemicalService.onChemicalEdited(updatedChemical);
            tick();

            expect(errorHandlerService.successMessage$.getValue()).toEqual(`${updatedChemical.name} was successfully updated`);
        }));

        it('should update the error message in state if the request fails', fakeAsync(() => {
            httpClientSpy.put.and.returnValue(
                of({}).pipe(map(() => {
                    throw new HttpErrorResponse(
                        {
                            status: 500,
                            error: {
                                message: 'Internal Server Error'
                            },
                            statusText: 'Oh Dear!'
                        }
                    );
                })));

            const errorMessageSpy = spyOn(errorHandlerService, 'handleError').and.callThrough();

            chemicalService.onChemicalEdited(updatedChemical);
            tick();

            expect(errorMessageSpy).toHaveBeenCalled();
            expect(errorHandlerService.errorMessage$.getValue()).toEqual('Http failure response for (unknown url): 500 Oh Dear!');
        }));

        it('should call update', () => {
            spyOn(chemicalService, 'updateChemical').and.returnValue(of(chemicalTwo));
            spyOn(chemicalService, 'update').and.callThrough();

            httpClientSpy.put.and.returnValue(asyncData(updatedChemical));
            chemicalService.onChemicalEdited(updatedChemical);

            chemicalService.updateChemical(chemicalTwo).subscribe({
                next: (chemical) => {
                    expect(chemical).toEqual(chemicalTwo);

                    expect(chemicalService.update).toHaveBeenCalledWith(chemicalTwo);
                }
            });
        });
    });

    describe('updateChemical', () => {

        it('should update lastUpdatedBy field with the logged in user', async () => {
            httpClientSpy.put.and.returnValue(asyncData(updatedChemical));
            chemicalService.loggedInUser = 'test.user@md.catapult.org.uk';

            chemicalService.updateChemical(updatedChemical).subscribe((chem: Chemical) => {

                expect(chem.lastUpdatedBy).toEqual('test.user@md.catapult.org.uk');
            });
        });

    });

    describe('update', () => {

        it('should update allChemicals', () => {
            spyOn(chemicalService, 'setAllChemicals').and.callThrough();
            chemicalService.update(newChemical);

            expect(chemicalService.setAllChemicals).toHaveBeenCalled();
        });

        it('should update filteredChemicals', () => {
            spyOn(chemicalService, 'setFilteredChemicals').and.callThrough();
            chemicalService.update(newChemical);

            expect(chemicalService.setFilteredChemicals).toHaveBeenCalled();
        });
    });

    describe('archive', () => {

        it('should archive a chemical which is not already archived', () => {
            spyOn(chemicalService, 'updateChemical').and.returnValue(of(chemicalTwo));
            chemicalService.archive(chemicalTwo);

            expect(chemicalTwo.isArchived).toEqual(true);
        });

        it('should unarchive a chemical which is already archived', () => {
            spyOn(chemicalService, 'updateChemical').and.returnValue(of(chemicalTwo));
            chemicalService.archive(chemicalTwo);

            expect(chemicalTwo.isArchived).toEqual(false);
        });

        it('should call updateChemical', () => {
            spyOn(chemicalService, 'updateChemical').and.returnValue(of(chemicalThree));
            chemicalService.archive(chemicalThree);

            expect(chemicalService.updateChemical).toHaveBeenCalled();
        });

        it('should call update', () => {
            spyOn(chemicalService, 'updateChemical').and.returnValue(of(chemicalFour));
            spyOn(chemicalService, 'update').and.callThrough();

            chemicalService.archive(chemicalFour);

            expect(chemicalService.update).toHaveBeenCalledWith(chemicalFour);
        });

        it('should set success message in state if the request is successful', fakeAsync(() => {
            spyOn(chemicalService, 'updateChemical').and.returnValue(of(newChemical));
            chemicalService.archive(newChemical);
            tick();

            expect(errorHandlerService.successMessage$.getValue()).toEqual(`${newChemical.name} was successfully archived`);
        }));

        it('should update the error message in state if the request fails', fakeAsync(() => {
            spyOn(chemicalService, 'updateChemical').and.returnValue(
                of({}).pipe(map(() => {
                        throw new HttpErrorResponse(
                            {
                                status: 500,
                                error: {
                                    message: 'Internal Server Error'
                                },
                                statusText: 'Oh Dear!'
                            }
                        );
                    }
                ))
            );
            const errorMessageSpy = spyOn(errorHandlerService, 'handleError').and.callThrough();

            chemicalService.archive(newChemical);
            tick();

            expect(errorMessageSpy).toHaveBeenCalled();
            expect(errorHandlerService.errorMessage$.getValue()).toEqual('Http failure response for (unknown url): 500 Oh Dear!');
        }));
    });

    describe('refreshCupboardFilterList', () => {

        it('should return a list of all cupboards if the lab is All', () => {
            chemicalService.labFilterControl.setValue('All');
            chemicalService.refreshCupboardsFilterList();

            expect(chemicalService.cupboardFilterValues.sort()).toEqual(['All', 'cupboard 1', 'cupboard 2', 'cupboard 3'].sort());
        });

        it('list of cupboards should not contain duplicates', () => {

            expect(chemicalService.cupboardFilterValues.sort()).toEqual(['All', 'cupboard 1', 'cupboard 2', 'cupboard 3'].sort());
        });

        it('list of cupboards should contain All', () => {

            expect(chemicalService.cupboardFilterValues).toContain('All');
        });

        it('should return a filtered list of cupboards when a lab is selected', () => {
            chemicalService.labFilterControl.setValue('Lab 1');
            chemicalService.refreshCupboardsFilterList();

            expect(chemicalService.cupboardFilterValues.sort()).toEqual(['All', 'cupboard 2'].sort());
        });
    });

    describe('filterChemicals', () => {

        it('should sort the filtered chemicals by name', () => {
            const actual = chemicalService.filterChemicals(true, 'All', 'All', 'All', 'Any', '', '');

            const expected = allChemicals.sort((a, b) => {
                if (a.name < b.name) {

                    return -1;
                }
                if (a.name > b.name) {

                    return 1;
                }

                return 0;
            });

            expect(actual).toEqual(expected);
        });

    });
});