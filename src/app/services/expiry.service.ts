import moment from 'moment';
import { Injectable } from '@angular/core';

import { Chemical, Expiry, ExpiryColor, red, yellow } from '../coshh/types';

@Injectable({
  providedIn: 'root'
})
export class ExpiryService {

  constructor() { }

  getExpiryColour(chemical: Chemical): ExpiryColor {

    const timeUntilExpiry = this.daysUntilExpiry(chemical);

    if (timeUntilExpiry < 30 && timeUntilExpiry > 0) {

      return yellow;
    }
    if (timeUntilExpiry <= 0) {

      return red;
    }

    return '';
  }


  daysUntilExpiry(chemical: Chemical): number {
    return moment(chemical.expiry).startOf('day').diff(moment().startOf('day'), 'days');
  }


  filterExpiryDate(chemical: Chemical, expiry: Expiry): boolean {

    const timeUntilExpiry = this.daysUntilExpiry(chemical);

    switch (expiry) {
      case 'Any':

        return true;
      case '< 30 Days':

        return timeUntilExpiry < 30 && timeUntilExpiry > 0;
      case 'Expired':

        return timeUntilExpiry <= 0;
    }
  }
}
