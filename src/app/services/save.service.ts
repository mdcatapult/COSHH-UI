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

import autoTable, { UserOptions } from 'jspdf-autotable';
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import moment from 'moment';
import writeXlsxFile, { Columns, SheetData } from 'write-excel-file';

import { Chemical, columnsForExport } from '../coshh/types';
import { ChemicalService } from './chemical.service';
import { DateTimeFormatPipe } from '../utility/pipes/my-datetime-format.pipe';

@Injectable({
    providedIn: 'root'
})
export class SaveService {
    constructor(public chemicalService: ChemicalService) {
    }

    // attempts to use css @media query to set print options programmatically were unsuccessful
    // in the print dialog window the user will need to change the orientation to landscape and the scale to 50% for
    // it to fit on an A4 page
    printInventory() {
        window.print();
    }

    async writeExcelFileWrapper(data: SheetData, options: {
        columns: Columns,
        fileName: string,
        orientation: 'landscape'
    }) {
        return writeXlsxFile(data, options);
    }

    async saveExcel() {
        const { data, columnOptions } = this.createExcelData(columnsForExport,
            this.chemicalService.getFilteredChemicals());

        if (data) {
            await this.writeExcelFileWrapper(data, {
                columns: columnOptions,
                fileName: 'mdc-coshh-inventory.xlsx',
                orientation: 'landscape'
            });
        }
    };

    callAutoTable(doc: jsPDF, options: UserOptions) {
        return autoTable(doc, options);
    }

    callSaveJsPDF(doc: jsPDF, filename: string) {
        doc.save(filename);
    };

    savePDF() {
        const chemicalsToPrint = this.createPDFData(this.chemicalService.getFilteredChemicals());

        const doc = new jsPDF('landscape');

        const now = moment().format('DD-MM-YYYY');

        doc.text(`MDC COSHH Inventory (${now})`, 100, 15);
        this.callAutoTable(doc, {
            startY: 25,
            head: [Object.keys(chemicalsToPrint[0])],
            body: chemicalsToPrint.map((column) => Object.values(column)),
            theme: 'striped',
            styles: {
                minCellWidth: 30
            }
        });

        this.callSaveJsPDF(doc, 'mdc-coshh-inventory.pdf');
    };

    createPDFData(chemicals: Chemical[]) {
        const dateTimePipe = new DateTimeFormatPipe();

        return chemicals.map((chemical) => {

            return {
                'Name': chemical.name || '',
                'Quantity': chemical.quantity || '',
                'CAS No.': chemical.casNumber || '',
                'State': chemical.matterState || '',
                'Location': chemical.location || '',
                'Cupboard': chemical.cupboard || '',
                'Safety data sheet': chemical.safetyDataSheet || '',
                'Added': chemical.added ? dateTimePipe.transform(chemical.added.toString()) : '',
                'Expiry': chemical.expiry ? dateTimePipe.transform(chemical.expiry.toString()) : ''
            };
        });
    }

    createExcelData(columnNames: string[], chemicals: Chemical[]) {
        const HEADER_ROW: SheetData = [columnNames.map((columnName) => {

            return { value: columnName, fontSize: 15, fontWeight: 'bold', align: 'center' };
        })];

        const chemicalsToSave: SheetData = chemicals.map((chemical) => {
            const row: SheetData = [[
                { type: String, value: chemical.casNumber || '' },
                { type: String, value: chemical.name || '', wrap: true },
                { type: String, value: chemical.hazards?.join(':') || '' },
                { type: String, value: chemical.location || '' },
                { type: String, value: chemical.cupboard || '' },
                { type: Number, value: chemical.id || '' },
                { type: String, value: chemical.matterState || '' },
                { type: String, value: chemical.quantity || '' },
                chemical.added ? {
                    type: Date,
                    value: new Date(chemical.added.toString()),
                    format: 'dd/mm/yyyy'
                } : { type: String, value: '' },
                chemical.expiry ? {
                    type: Date,
                    value: new Date(chemical.expiry.toString()),
                    format: 'dd/mm/yyyy'
                } : { type: String, value: '' },
                { type: String, value: chemical.safetyDataSheet || '', wrap: true },
                { type: String, value: chemical.coshhLink || '', wrap: true },
                { type: String, value: chemical.storageTemp || '', wrap: true },
                { type: String, value: chemical.owner || '', wrap: true },
                { type: String, wrap: true }
            ]];

            // this looks weird but it's the only way to get the types to play ball
            return row[0];
        });

        const data: SheetData = [...HEADER_ROW, ...chemicalsToSave];

        const columnOptions: Columns = [{ width: 30 }, {}, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 50 }, { width: 12 }, { width: 12 }, { width: 50 }];

        return { data, columnOptions };
    }

}