import { TestBed } from '@angular/core/testing';
import moment from 'moment';

import { Chemical, red, yellow } from '../coshh/types';
import { ExpiryService } from './expiry.service';

describe('ExpiryServiceService', () => {
  let service: ExpiryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpiryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('daysUntilExpiry', () => {

    const chem: Chemical = {
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
      const chem: Chemical = {
        id: 0,
        casNumber: '',
        name: '',
        chemicalNumber: '',
        matterState: 'solid',
        quantity: '',
        added: moment(),
        expiry: moment().clone().add(29, 'days'),
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
      expect(service.getExpiryColour(chem)).toBe(yellow);
    });

    it('should return red for chemical that has expired', () => {
      const chem: Chemical = {
        id: 0,
        casNumber: '',
        name: '',
        chemicalNumber: '',
        matterState: 'solid',
        quantity: '',
        added: moment(),
        expiry: moment().clone().subtract(1, 'days'),
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
      expect(service.getExpiryColour(chem)).toBe(red);
    });

    it('should return empty string for chemical with expiry date 30 or more days oin the future', () => {
        const chem: Chemical = {
            id: 0,
            casNumber: '',
            name: '',
            chemicalNumber: '',
            matterState: 'solid',
            quantity: '',
            added: moment(),
            expiry: moment().clone().add(30, 'days'),
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
        expect(service.getExpiryColour(chem)).toBe('');
    });

  });

});
