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

import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() {
  }

  readonly errorMessage$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  readonly successMessage$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  setErrorMessage = (message: string) => {
    this.errorMessage$.next(message);
};

  setSuccessMessage = (message: string) => {
    this.successMessage$.next(message);
  };

  handleError = (error: HttpErrorResponse) => {
    this.setErrorMessage(error.message);

    return EMPTY;
  };
}
