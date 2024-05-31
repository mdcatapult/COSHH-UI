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

    it('should get chemicals from the data service on initialisation', () => {

    });

    it('should set chemicals in state on initialisation', () => {

    });

    it('should filter chemicals when filters are applied', () => {

    });

    it('should get labs from the data service on initialisation', () => {

    });

    it('should set labs in state on initialisation', () => {

    });

    it('should get cupboards from the data service on initialisation', () => {

    });

    it('should set cupboards in state on initialisation', () => {

    });

    it('should update cupboards when a lab is selected', () => {

    });

    it('should get logged in user details on initialisation', () => {

    });

    it('should set user details in state on initialisation', () => {

    });

    it('should add \'All\' to the list of labs', () => {

    });

    it('should add \'All\' to the list of cupboards', () => {

    });

    describe('onChemicalAdded', () => {


    it('should add the new chemical to allChemicals', () => {

        });

        it('should add the new chemical to filteredChemicals if it matches the current filters', () => {

        });

        it('should not add the new chemical to filteredChemicals if it does not match the current filters', () => {

        });

        it('should get hazard list for the new chemical', () => {

        });

        it('should get expiryColour for the new chemical', () => {

        });

        it('should format the cupboard name for the new chemical', () => {

        });

        it('should make a POST request to the API to add the new chemical', () => {

        });
    });

    describe('onChemicalEdited', () => {

        it('should get hazard list for updated chemical', () => {

        });

        it('should get expiryColour for updated chemical', () => {

        });

        it('should format the cupboard name for updated chemical', () => {

        });

        it('should update the lastUpdatedBy field with the logged in user', () => {

        });

        it('should call updateChemical', () => {

        });

        it('should call updateHazards', () => {

        });

        it('should call update', () => {

        });
    });

    describe('updateChemical', () => {

        it('should format cupboard name', () => {

        });

        it('should update lastUpdatedBy field with the logged in user', () => {

        });

        it('should make a PUT request to the API to update the chemical', () => {

        });
    });

    describe('update', () => {

        it('should update allChemicals', () => {

        });

        it('should update filteredChemicals', () => {

        });
    });

    describe('archive', () => {

        it('should archive a chemical which is not already archived', () => {

        });

        it('should unarchive a chemical which is already archived', () => {

        });

        it('shuld call updateChemical', () => {

        });

        it('should call update', () => {

        });
    });

    describe('refreshCupboardFilterList', () => {

        it('should return a list of all cupboards if the lab is All', () => {

        });

        it('list of cupboards should not contain duplicates', () => {

        });

        it('list of cupboards should contain All', () => {

        });

        it('should return a filtered list of cupboards when a lab is selected', () => {

        });
    });

    describe('filterChemicals', () => {

        it('should not apply cupboard filter when All is selected', () => {

        });

        it('should not apply hazard filter when All is selected', () => {

        });

        it('should not apply lab filter when All is selected', () => {

        });

        it('should sort the filtered chemicals by name', () => {

        });

    });
});