import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() {
  }

  private readonly errorMessage$: BehaviorSubject<string> = new BehaviorSubject<string>('')

  setErrorMessage = (message: string) => {
    this.errorMessage$.next(message)
};

  handleError = (error: HttpErrorResponse) => {
    console.error(error);
    this.setErrorMessage(error.message)

    return EMPTY;
  };
}
