import moment from 'moment';
import { TestBed } from '@angular/core/testing';

import { Chemical, red, yellow } from '../coshh/types';
import { ExpiryService } from './expiry.service';
import { chemicalOne } from '../../test-data/test-data';

describe('ExpiryServiceService', () => {
    const chem = chemicalOne;

    let service: ExpiryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ExpiryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('daysUntilExpiry', () => {

        it('should be 0 for chemical expiring today', () => {
            chem.expiry = moment();

            expect(service.daysUntilExpiry(chem)).toBe(0);
        });

        it('should be 1 for chemical expiring tomorrow', () => {
            chem.expiry = moment().clone().add(1, 'days');

            expect(service.daysUntilExpiry(chem)).toBe(1);
        });

        it('should be -1 for chemical that expired yesterday', () => {
            chem.expiry = moment().clone().subtract(1, 'days');

            expect(service.daysUntilExpiry(chem)).toBe(-1);
        });

        // >= because unknown amount of leap years exist in next 10 years
        it('should be >= 3650 for chemical that expires in 10 years', () => {
            chem.expiry = moment().clone().add(10, 'years');

            expect(service.daysUntilExpiry(chem)).toBeGreaterThanOrEqual(3650);
        });

    });

    describe('getExpiryColour', () => {

        it('should return yellow for chemical expiring in fewer than 30 days', () => {
            chem.expiry = moment().clone().add(29, 'days');

            expect(service.getExpiryColour(chem)).toBe(yellow);
        });

        it('should return red for chemical that has expired', () => {
            chem.expiry = moment().clone().subtract(1, 'days');

            expect(service.getExpiryColour(chem)).toBe(red);
        });

        it('should return empty string for chemical with expiry date 30 or more days oin the future', () => {
            chem.expiry = moment().clone().add(30, 'days');

            expect(service.getExpiryColour(chem)).toBe('');
        });

    });

    describe('filterExpiryDate', () => {

        it('should return true for \'Any\' expiry date', () => {
            const chemOne: Chemical = chemicalOne;

            chemOne.expiry = moment().clone().add(29, 'days');

            const chemTwo: Chemical = chemicalOne;

            chemTwo.expiry = moment().clone().subtract(1, 'days');

            const chemThree: Chemical = chemicalOne;

            chemThree.expiry = moment().clone().add(30, 'days');

            expect(service.filterExpiryDate(chemOne, 'Any')).toBe(true);
            expect(service.filterExpiryDate(chemTwo, 'Any')).toBe(true);
            expect(service.filterExpiryDate(chemThree, 'Any')).toBe(true);
        });

        it('should return true when passed \'< 30 Days\' and expiry date is greater than 0 and less than 30 days in the future', () => {
            chem.expiry = moment().clone().add(29, 'days');

            expect(service.filterExpiryDate(chem, '< 30 Days')).toBe(true);
        });

        it('should return true when passed \'Expired\' and expiry date is in the past', () => {
            chem.expiry = moment().clone().subtract(1, 'days');

            expect(service.filterExpiryDate(chem, 'Expired')).toBe(true);
        });
    });

});
