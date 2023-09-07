import {AbstractControl, UntypedFormControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {map, Observable} from "rxjs";
import {Columns, SheetData} from "write-excel-file";

import {DateTimeFormatPipe} from './pipes/my-datetime-format.pipe';
import {Chemical} from "../coshh/types";

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

export function createExcelData(columnNames: String[], chemicals: Chemical[]) {
    const HEADER_ROW: SheetData = [columnNames.map(columnName => {

        return {value: columnName, fontSize: 15, fontWeight: 'bold', align: 'center'}
    })]
    const chemicalsToSave: SheetData = chemicals.map(chemical => {
        const row: SheetData = [[
            {type: String, value: chemical.name || '', wrap: true},
            {type: String, value: chemical.quantity || ''},
            {type: String, value: chemical.location || ''},
            {type: String, value: chemical.safetyDataSheet || '', wrap: true},
            chemical.added ? {type: Date, value: new Date(chemical.added.toString()), format: 'dd/mm/yyyy'} : {type: String, value: ''},
            chemical.expiry ? {type: Date, value: new Date(chemical.expiry.toString()), format: 'dd/mm/yyyy'} : {type: String, value: ''},
            {type: String, wrap: true}
        ]]

        // this looks weird but it's the only way to get the types to play ball
        return row[0]
    })
    const data: SheetData = [...HEADER_ROW, ...chemicalsToSave]
    const columnOptions: Columns = [{width: 30}, {}, {width: 15}, {width: 50}, {width: 12}, {width: 12}, {width: 50}]

    return {data, columnOptions}
}

export function createPDFData(chemicals: Chemical[]) {
    const dateTimePipe = new DateTimeFormatPipe()

    return chemicals.map(chemical => {

        return {
            'Name': chemical.name || '',
            'Quantity': chemical.quantity || '',
            'Location': chemical.location || '',
            'Safety data sheet': chemical.safetyDataSheet || '',
            'Added': chemical.added ? dateTimePipe.transform(chemical.added.toString()) : '',
            'Expiry': chemical.expiry ? dateTimePipe.transform(chemical.expiry.toString()) : ''
        }
    })
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

    return url.protocol === "http:" || url.protocol === "https:";
}

export function urlValidator(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {

            return null
        }

        return isValidHttpUrl(control.value) ? null : {invalidURL: control.value};
    }
}

/**
 * Remove duplicates from an array of strings. Case insensitive.
 * @param things
 */
export function checkDuplicates(things: string[]): string[] {
    let duplicatesRemoved: string[] = Array.from(new Set(things.map(e => e.toLowerCase())));
    return duplicatesRemoved
}