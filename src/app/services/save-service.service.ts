import * as moment from 'moment';
import autoTable from 'jspdf-autotable';
import { createExcelData, createPDFData } from '../utility/utilities';
import { columnsForExport } from '../coshh/types';
import jsPDF from 'jspdf';
import { Injectable, OnInit } from '@angular/core';
import writeXlsxFile from 'write-excel-file';

@Injectable({
    providedIn: 'root'
})
export class saveService implements OnInit {

    // attempts to use css @media query to set print options programmatically were unsuccessful
// in the print dialog window the user will need to change the orientation to landscape and the scale to 50% for
// it to fit on an A4 page

    ngOnInit(): void {}

    
    printInventory() {
        window.print();
    }

    async saveExcel() {
        const { data, columnOptions } = createExcelData(columnsForExport, this.getChemicals());

        await writeXlsxFile(data, {
            columns: columnOptions,
            fileName: 'mdc-coshh-inventory.xlsx',
            orientation: 'landscape'
        });
    }

    savePDF() {
        const chemicalsToPrint = createPDFData(this.getChemicals());

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
