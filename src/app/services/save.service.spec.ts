import { AuthModule } from '@auth0/auth0-angular';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SaveService } from './save.service';
import { TestBed } from '@angular/core/testing';

import { allChemicals } from '../../test-data/test-data';
import { ChemicalService } from './chemical.service';
import * as jspdf from "jspdf";
import autoTable from "jspdf-autotable";


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

    describe('printInventory', () => {

        it('should print the inventory', () => {
            spyOn(window, 'print');
            service.printInventory();

            expect(window.print).toHaveBeenCalled();
        });
    });

    describe('saveExcel', () => {

        it('should call chemical service getFilteredChemicals', () => {
            const spy = spyOn(service.chemicalService, 'getFilteredChemicals').and.callThrough();

            service.saveExcel();

            expect(spy).toHaveBeenCalled();
        });

        it('should call createExcelData', () => {
            const spy = spyOn(service, 'createExcelData').and.callThrough();

            service.saveExcel();

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('savePDF', () => {

        it('should call chemical service getFilteredChemicals', () => {
            const spy = spyOn(service.chemicalService, 'getFilteredChemicals')
                .and.returnValue(allChemicals);

            // TODO this works, BUT tries to save a pdf when the test is run.  All atempts to use mocks and spies
            //  to prevent this behaviour have been unsuccessful.  Tried extracting the save method on jspdf to a
            //  separate function and mocking that but it still tries to save the pdf.

            const mockJsPDF = jasmine.createSpyObj('jsPDF', ['save']);

            // Mock the save method to do nothing
            mockJsPDF.save.and.callFake(() => {});

            // Mock the callSaveJsPDF method to prevent actual save
            spyOn(service, 'callSaveJsPDF').and.callFake(() => {});

            service.savePDF();

            expect(spy).toHaveBeenCalled();
        });
    });
});