import moment from 'moment';
import autoTable from 'jspdf-autotable';
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
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

    async saveExcel() {
        const { data, columnOptions } = this.createExcelData(columnsForExport,
            this.chemicalService.getFilteredChemicals());

        if (data) {
            await writeXlsxFile(data, {
                columns: columnOptions,
                fileName: 'mdc-coshh-inventory.xlsx',
                orientation: 'landscape'
            });
        }
    };

    createJsPDF() {
        return new jsPDF('landscape')
    };

    callSaveJsPDF(doc: jsPDF, filename: string) {
        doc.save(filename);
    };

    savePDF() {
        const chemicalsToPrint = this.createPDFData(this.chemicalService.getFilteredChemicals());

        const doc = this.createJsPDF()

        const now = moment().format('DD-MM-YYYY');

        doc.text(`MDC COSHH Inventory (${now})`, 100, 15);
        autoTable(doc, {
            startY: 25,
            head: [Object.keys(chemicalsToPrint[0])],
            body: chemicalsToPrint.map((column) => Object.values(column)),
            theme: 'striped',
            styles: {
                minCellWidth: 30
            }
        });
        this.callSaveJsPDF(doc, 'mdc-coshh-inventory.pdf')
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
                { type: String, value: chemical.name || '', wrap: true },
                { type: String, value: chemical.quantity || '' },
                { type: String, value: chemical.casNumber || '' },
                { type: String, value: chemical.matterState || '' },
                { type: String, value: chemical.location || '' },
                { type: String, value: chemical.cupboard || '' },
                { type: String, value: chemical.safetyDataSheet || '', wrap: true },
                chemical.added ? { type: Date, value: new Date(chemical.added.toString()), format: 'dd/mm/yyyy' } : { type: String, value: '' },
                chemical.expiry ? { type: Date, value: new Date(chemical.expiry.toString()), format: 'dd/mm/yyyy' } : { type: String, value: '' },
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