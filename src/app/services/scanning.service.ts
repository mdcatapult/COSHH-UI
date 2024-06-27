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
