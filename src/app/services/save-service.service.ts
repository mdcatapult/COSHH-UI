import * as moment from 'moment';
import { Injectable } from '@angular/core';

import autoTable from 'jspdf-autotable';
import { createExcelData, createPDFData } from '../utility/utilities';
import { columnsForExport } from '../coshh/types';
import jsPDF from 'jspdf';
import writeXlsxFile from 'write-excel-file';
import { ChemicalService } from './chemical-service.service';

@Injectable({
    providedIn: 'root'
})
export class SaveService{
    constructor(public chemicalService: ChemicalService) {}

    // attempts to use css @media query to set print options programmatically were unsuccessful
    // in the print dialog window the user will need to change the orientation to landscape and the scale to 50% for
    // it to fit on an A4 page

    printInventory() {
        window.print();
    }

    async saveExcel() {
        const { data, columnOptions } = createExcelData(columnsForExport, 
            this.chemicalService.getFilteredChemicals());
        
            console.log(data, columnOptions, 'data and columnOptions');

        await writeXlsxFile(data, {
            columns: columnOptions,
            fileName: 'mdc-coshh-inventory.xlsx',
            orientation: 'landscape'
        });
    }

    savePDF() {
        const chemicalsToPrint = createPDFData(this.chemicalService.getFilteredChemicals());

        console.log(chemicalsToPrint, 'chemicalsToPrint');

        const doc = new jsPDF('landscape');

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
        doc.save('mdc-coshh-inventory.pdf');
    }

}