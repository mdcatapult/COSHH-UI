import {UntypedFormControl} from "@angular/forms";
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
            {type: String, value: chemical.name, wrap: true},
            {type: Number, value: parseInt(chemical.quantity)},
            {type: String, value: chemical.location},
            {type: String, value: chemical.safetyDataSheet, wrap: true},
            {type: Date, value: new Date(chemical.added.toString()), format: 'dd/mm/yyyy'},
            {type: Date, value: new Date(chemical.expiry.toString()), format: 'dd/mm/yyyy'},
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
            'Name': chemical.name,
            'Quantity': chemical.quantity,
            'Location': chemical.location,
            'Safety data sheet': chemical.safetyDataSheet,
            'Added': dateTimePipe.transform(chemical.added.toString()),
            'Expiry': dateTimePipe.transform(chemical.expiry.toString())
        }
    })
}