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
