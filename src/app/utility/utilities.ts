import {map, Observable} from "rxjs";
import {UntypedFormControl} from "@angular/forms";


export function getAutocompleteObservable(formControl: UntypedFormControl, data: string[]): Observable<string[]> {
    return formControl.valueChanges.pipe(
        map(value => {
                return data
                    .filter((option: string) => option.toLowerCase()
                        .includes(value.toLowerCase()))
            }
        )
    )
}