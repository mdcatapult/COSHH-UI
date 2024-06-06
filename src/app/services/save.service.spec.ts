import { AuthModule } from '@auth0/auth0-angular';
import 'jspdf-autotable';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { allChemicals, chemicalOne } from '../../test-data/test-data';
import { ChemicalService } from './chemical.service';
import { SaveService } from './save.service';


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

            // Mock the writeExcelFileWrapper function to do nothing
            spyOn(service, 'writeExcelFileWrapper').and.callFake(() => Promise.resolve(new Blob()));
            service.saveExcel();

            expect(spy).toHaveBeenCalled();
        });

        it('should call createExcelData', () => {
            const spy = spyOn(service, 'createExcelData').and.callThrough();

            // Mock the writeExcelFileWrapper function to do nothing
            spyOn(service, 'writeExcelFileWrapper').and.callFake(() => Promise.resolve(new Blob()));
            service.saveExcel();

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('savePDF', () => {

        it('should call chemical service getFilteredChemicals', () => {
            const spy = spyOn(service.chemicalService, 'getFilteredChemicals')
                .and.returnValue(allChemicals);

            // Mock the callSaveJsPDF method to prevent actual save
            spyOn(service, 'callSaveJsPDF').and.callFake(() => {
            });
            service.savePDF();

            expect(spy).toHaveBeenCalled();
        });

        it('should call autotable with the correct parameters', () => {
            spyOn(service.chemicalService, 'getFilteredChemicals')
                .and.returnValue(allChemicals);

            // Spy on callAutoTable
            const spy = spyOn(service, 'callAutoTable').and.callThrough();

            // Mock the callSaveJsPDF method to prevent actual save
            spyOn(service, 'callSaveJsPDF').and.callFake(() => {
            });

            service.savePDF();

            // Assert that autoTable was called with the correct parameters
            expect(spy).toHaveBeenCalledWith(jasmine.any(Object),
                {
                    startY: 25,
                    head: [['Name', 'Quantity', 'CAS No.', 'State', 'Location', 'Cupboard', 'Safety data sheet', 'Added', 'Expiry']],
                    body: jasmine.any(Array),
                    theme: 'striped',
                    styles: {
                        minCellWidth: 30
                    },
                });
        });
    });

    describe('createPDFData', () => {

        it('should return an array of objects with the correct keys and values', () => {
            const result = service.createPDFData([chemicalOne]);

            expect(result).toEqual(jasmine.arrayContaining([
                jasmine.objectContaining({
                    'Name': 'Chemical 1',
                    'Quantity': '',
                    'CAS No.': '',
                    'State': 'solid',
                    'Location': 'Lab 1',
                    'Cupboard': 'Cupboard 2',
                    'Safety data sheet': '',
                    'Added': jasmine.any(String),
                    'Expiry': jasmine.any(String)
                }),
            ]));
        });
    });

    describe('createExcelData', () => {

        it('should return an object with data and columnOptions keys', () => {
            const result = service.createExcelData(['Name', 'Quantity', 'CAS No.'], [chemicalOne]);

            expect(result).toEqual(jasmine.objectContaining({
                data: jasmine.any(Array),
                columnOptions: jasmine.any(Array)
            }));
        });

        it('should return an object with data and columnOptions keys', () => {
            const result = service.createExcelData(['Name', 'Quantity', 'CAS No.'], [chemicalOne]);

            expect(result).toEqual(jasmine.objectContaining({
                data: jasmine.any(Array),
                columnOptions: jasmine.any(Array)
            }));
        });

        it('should return an object with data and columnOptions arrays of the correct length', () => {
            const result = service.createExcelData(['Name', 'Quantity', 'CAS No.'], [chemicalOne]);

            // there should be 10 columns
            expect(result.columnOptions.length).toEqual(10);
            // expect a header row and a single row representing the single passed chemical
            expect(result.data.length).toEqual(2);
        });
    });

});