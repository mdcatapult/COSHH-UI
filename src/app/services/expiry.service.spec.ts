import { TestBed } from '@angular/core/testing';

import { ExpiryService } from './expiry.service';
import { Chemical } from '../coshh/types';
import moment from 'moment';

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
});
