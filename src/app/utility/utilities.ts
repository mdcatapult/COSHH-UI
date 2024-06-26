import { AbstractControl, UntypedFormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { EMPTY, map, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


export function getAutocompleteObservable(formControl: UntypedFormControl, data: string[]): Observable<string[]> {
    return formControl.valueChanges.pipe(
        map((value) => {
                return data
                    .filter((option: string) => option.toLowerCase()
                        .includes(value.toLowerCase()));
            }
        )
    );
}

/**
 * Test whether a string is a valid Http URL
 * @param urlString
 */
export function isValidHttpUrl(urlString: string): boolean {
    let url;

    try {
        url = new URL(urlString);
    } catch (_) {

        return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
}

export function urlValidator(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {

            return null;
        }

        return isValidHttpUrl(control.value) ? null : { invalidURL: control.value };
    };
}
/**
 * Remove duplicates from an array of strings. Case insensitive.
 * @param things
 */
/**
 * Remove duplicates from an array of strings. Case insensitive.
 * @param things
 */
export function checkDuplicates(things: string[]): string[] {

    return Array.from(new Set(things.map((e) => e.toLowerCase().trim())));
}

/**
 * Format a string to lowercase, trim whitespace and replace multiple consecutive whitespace characters with a single space
 * @param text
 */
export function formatString(text: string): string {

    return text ? text.toLowerCase().trim().replace(/\s\s+/g, ' ') : '';
}