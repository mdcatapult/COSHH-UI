import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ChemicalService } from './chemical.service';
import { ScanChemicalComponent } from '../scan-chemical/scan-chemical.component';

@Injectable({
  providedIn: 'root'
})
export class ScanningService {

  constructor(private chemicalService: ChemicalService,
              public dialog: MatDialog
  ) { }

  dialogOpen: boolean = false;
  scannedBarcode: string = '';
  scanningMode: boolean = false;

  onDialogOpen(v: boolean): void {
    this.dialogOpen = v;
    this.scanningMode = !v;
  }


  barcodeScanned = () => {
    if (!this.dialogOpen) {
      const dialog = this.dialog.open(ScanChemicalComponent, {
        width: '20vw',
        data: {
          chemicalNumber: this.scannedBarcode,
          chemical: this.chemicalService.getAllChemicals()
              .find((chemical) => chemical.chemicalNumber === this.scannedBarcode),
          archive: this.chemicalService.updateChemical
        }
      });

      dialog.afterOpened().subscribe(() => {
        this.dialogOpen = true;
      });

      dialog.afterClosed().subscribe(() => {
        this.scannedBarcode = '';
        this.dialogOpen = false;
      });
    }
  };
}
