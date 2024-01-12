import { AuthService } from '@auth0/auth0-angular';
import { combineLatest, startWith } from 'rxjs';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { UntypedFormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Chemical, columnTypes, Hazard } from './types';
// environment.ts is added at compile time by npm run start command
import { isValidHttpUrl, checkDuplicates } from '../utility/utilities';
import { environment } from 'src/environments/environment';
import { FilterService } from '../filter.service';
import { HazardService } from '../services/hazard-service.service';
import { ChemicalService } from '../services/chemical-service.service';
import { SaveService } from '../services/save-service.service';
import { ScanChemicalComponent } from '../scan-chemical/scan-chemical.component';



@Component({
    selector: 'app-coshh',
    templateUrl: './coshh.component.html',
    styleUrls: ['./coshh.component.scss']
})
export class CoshhComponent implements OnInit {

    scanningMode: boolean = false;
    private scannedBarcode: string = '';
    dialogOpen: boolean = false;

    onDialogOpen(v:boolean): void {
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
                this.refresh();
                this.scannedBarcode = '';
                this.dialogOpen = false;
            });
        }
    };

    @HostListener('window:keypress', ['$event'])
    keyEvent(event: KeyboardEvent): void {
        event.key === 'Enter' && this.scanningMode ? this.barcodeScanned(): this.scannedBarcode += event.key;
    }

    isAuthenticated$ = this.authService.isAuthenticated$;

    displayedColumns = ['buttons', 'casNumber', 'name', 'hazards', 'location', 'cupboard', 'chemicalNumber', 'matterState',
        'quantity', 'added', 'expiry', 'safetyDataSheet', 'coshhLink', 'storageTemp', 'owner'];

    constructor(private http: HttpClient,
                private fb: UntypedFormBuilder,
                private _liveAnnouncer: LiveAnnouncer,
                private authService: AuthService,
                private filterService: FilterService,
                public dialog: MatDialog, 
                public hazardService: HazardService,
                public chemicalService: ChemicalService,
                public saveService: SaveService) {

    }

    // chemicals = new Chemicals(); // this represents all the chemicals returned from the API
    cupboards: string[] = [];
    users: string[] = [];
    freezeColumns = false;
    loggedInUser: string = '';
    tableData!: MatTableDataSource<Chemical>;
    
    tableData$ = this.chemicalService.tableData;
   
    columns: string[] = columnTypes; // columns to display in table

    tooltipText = () => {
        const numberOfChemicals = this.chemicalService.getAllChemicals().length;

        const chemicalOrChemicals = numberOfChemicals === 1 ? 'chemical' : 'chemicals';

        return `${numberOfChemicals} ${chemicalOrChemicals} found with current filters`;
    };


    @ViewChild(MatSort) sort!: MatSort;

    ngOnInit(): void {

        this.tableData = new MatTableDataSource<Chemical>(this.chemicalService.getFilteredChemicals());
        
        this.chemicalService.filteredChemicals$
            .subscribe((filteredChemicals) => 
            {this.tableData.data = filteredChemicals;
                this.tableData.sort = this.sort;});

        this.http.get<string[]>(`${environment.backendUrl}/users`).subscribe((users) => {
            this.users = users;
        });

        combineLatest([
                this.hazardService.hazardFilterControl,
                this.chemicalService.cupboardFilterControl,
                this.chemicalService.labFilterControl,
                this.chemicalService.expiryFilterControl,
                this.chemicalService.toggleArchiveControl
            ].map((control) => control.valueChanges.pipe(startWith(control.value)))
        ).subscribe(() => {
            this.refresh();
            this.chemicalService.nameOrNumberSearchOptions = this.chemicalService.getNameOrNumberSearchObservable();
            this.chemicalService.ownerSearchOptions = this.chemicalService.getOwnerSearchObservable();
        });

    }


    refresh(): void {
        this.tableData.data = this.chemicalService.getFilteredChemicals();
        this.refreshCupboardsFilterList();
    }


    /**
     * Show only cupboards for currently selected lab. If 'All' labs it will show cupboards currently used over all the chemicals.
     * 'All' is always an option for cupboards filter so append it to the list
     */
    refreshCupboardsFilterList(): void {
        if (this.chemicalService.labFilterControl.value == 'All') {
            this.filterService.getCupboards().subscribe((cupboards) => {
                const dedupedCupboards: string[] = checkDuplicates(cupboards);

                this.chemicalService.cupboardFilterValues = dedupedCupboards.concat('All');
                this.cupboards = dedupedCupboards;
            });
        } else {
            this.filterService.getCupboardsForLab(this.chemicalService.labFilterControl.value).subscribe((cupboards) => {
                const dedupedCupboards: string[] = checkDuplicates(cupboards);

                this.chemicalService.cupboardFilterValues = dedupedCupboards.concat('All');
                this.cupboards = dedupedCupboards;
            });
        }
    }


    // set the activated property of all hazards other than the passed hazard to false and clear hazards from the passed chemical
    singleSelect(chemical: Chemical, hazardName: Hazard): Chemical {
        chemical.hazards = [hazardName];
        chemical.hazardList.forEach((hl) => {
            if (hl.title !== hazardName) {
                hl.activated = false;
            }
        });

        return chemical;
    }
    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) {
        // This example uses English messages. If your application supports
        // multiple language, you would internationalize these strings.
        // Furthermore, you can customize the message to add additional
        // details about the values being sorted.
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    protected readonly isValidHttpUrl = isValidHttpUrl;

}