import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UntypedFormBuilder, UntypedFormControl } from "@angular/forms";

import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { allHazards, Chemical, columnTypes, ExpiryColor, Hazard, HazardListItem, red, yellow } from './types';
import { combineLatest, debounceTime, map, Observable, startWith } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Chemicals } from './chemicals';

@Component({
    selector: 'app-coshh',
    templateUrl: './coshh.component.html',
    styleUrls: ['./coshh.component.scss']
})
export class CoshhComponent implements OnInit {

    displayedColumns = ["casNumber", "name", "hazards", "location", "cupboard", "chemicalNumber", "matterState", "quantity", "added", "expiry", "safetyDataSheet", "coshhLink", "storageTemp", "projectSpecific", "buttons"]

    constructor(private http: HttpClient, private fb: UntypedFormBuilder, private _liveAnnouncer: LiveAnnouncer) {
    }

    chemicals = new Chemicals() // this represents all the chemicals returned from the API
    cupboards: String[] = [];
    labs: String[] = [];
    projects: {} = {};
    projectSpecific: string[] = [];
    freezeColumns = false;

    getHazardListForChemical = (chemical: Chemical) => {
        return allHazards().map((hazard: Hazard) => {
            return {
                title: hazard,
                activated: chemical.hazards ? chemical.hazards.includes(hazard) : false,
                value: hazard
            }
        })
    }

    selectedHazards: Hazard[] = [];
    hazardFilterValues = (<string[]>allHazards()).concat('All')
    tableData = new MatTableDataSource<Chemical>() // data source for table
    columns: string[] = columnTypes // columns to display in table
    toggleArchiveControl = new UntypedFormControl(false)
    hazardFilterControl = new UntypedFormControl('All')

    labFilterControl = new UntypedFormControl('')
    labFilterValues: string[] = []

    cupboardFilterControl = new UntypedFormControl('All')
    cupboardFilterValues: string[] = []

    expiryFilterControl = new UntypedFormControl('Any')
    expiryFilterValues = ['Any', '< 30 Days', 'Expired']

    projectFilterControl = new UntypedFormControl('Any')
    projectFilterValues: string[] = []

    searchOptions: Observable<string[]> = new Observable()
    searchControl = new UntypedFormControl()

    @ViewChild(MatSort) sort!: MatSort;

    ngOnInit(): void {

        this.http.get<Array<Chemical>>(`${environment.backendUrl}/chemicals`)
            .subscribe((res: Array<Chemical>) => {
                res = res?.map((chem: Chemical) => {
                    chem.editSDS = false
                    chem.editCoshh = false
                    chem.backgroundColour = this.getExpiryColour(chem)
                    chem.hazardList = this.getHazardListForChemical(chem)
                    return chem
                })

                this.chemicals.set(res || [])
                const inStock = this.getChemicals()
                this.tableData = new MatTableDataSource<Chemical>(inStock)
                this.tableData.sort = this.sort;

                this.searchOptions = this.getSearchObservable()
            })

        this.http.get<string[]>(`${environment.backendUrl}/labs`).subscribe(labs => {
            this.labFilterValues = labs.concat('All')
            this.labFilterControl.setValue('All')
            this.labs = labs
        })

        this.http.get<string[][]>(`${environment.backendUrl}/projects`).subscribe(projects => {
            this.projectSpecific = projects.filter(
                // strip out header row and empty rows
                (elem, index) => index && elem[0] && elem[1]
            ).map(elem => `${elem[0]} - ${elem[1]}`)
            this.projectFilterValues = this.projectSpecific.concat('No', 'Any')
            this.projectFilterControl.setValue('Any')
        })

        this.searchControl.valueChanges.subscribe((value: string) => {
            this.tableData.data = this.getChemicals()
        })

        combineLatest([
            this.hazardFilterControl,
            this.cupboardFilterControl,
            this.labFilterControl,
            this.expiryFilterControl,
            this.projectFilterControl,
            this.toggleArchiveControl
        ].map(control => control.valueChanges.pipe(startWith(control.value)))
        ).subscribe(() => {
            this.refresh()
            this.searchOptions = this.getSearchObservable()
        })

    }

    getChemicals(): Chemical[] {
        return this.chemicals.get(
            this.toggleArchiveControl.value,
            this.cupboardFilterControl.value,
            this.hazardFilterControl.value,
            this.labFilterControl.value,
            this.expiryFilterControl.value,
            this.projectFilterControl.value,
            this.searchControl.value || "",
        )
    }


    archive(chemical: Chemical): void {
        chemical.isArchived = true
        this.updateChemical(chemical)

        this.refresh()
    }

    refresh(): void {
        this.tableData.data = this.getChemicals()
        this.refreshCupboardsFilterList()

    }

    refreshCupboardsFilterList(): void {
        this.http.get<string[]>(`${environment.backendUrl}/cupboards`).subscribe(cupboards => {
            this.cupboardFilterValues = cupboards.concat('All')
            this.cupboards = cupboards
        })
    }

    updateChemical(chemical: Chemical, refresh?: boolean): void {
        this.http.put(`${environment.backendUrl}/chemical`, chemical).pipe(
            debounceTime(100)
        ).subscribe(() => {
            this.chemicals.update(chemical)
            chemical.backgroundColour = this.getExpiryColour(chemical)
            if (refresh) this.refresh()
        })
    }

    updateHazards(chemical: Chemical): void {
        this.http.put(`${environment.backendUrl}/hazards`, chemical).pipe(
            debounceTime(100)
        ).subscribe(() => {
        })
    }

    onChemicalAdded(chemical: Chemical): void {this.http.post<Chemical>(`${environment.backendUrl}/chemical`, chemical).subscribe((addedChemical: Chemical) => {
            addedChemical.editSDS = false
            addedChemical.editCoshh = false
            addedChemical.hazardList = this.getHazardListForChemical(addedChemical)
            addedChemical.backgroundColour = this.getExpiryColour(chemical)
            this.chemicals.add(addedChemical)
            this.refresh()
            this.searchOptions = this.getSearchObservable()
        })
    }

    onChemicalEdited(chemical: Chemical): void {
        chemical.editSDS = false
        chemical.editCoshh = false
        chemical.hazardList = this.getHazardListForChemical(chemical)
        chemical.backgroundColour = this.getExpiryColour(chemical)
        this.updateChemical(chemical)
        this.updateHazards(chemical)
        this.chemicals.update(chemical)
        this.refresh()
        this.searchOptions = this.getSearchObservable()
    }

    getExpiryColour(chemical: Chemical): ExpiryColor {

        const timeUntilExpiry = Chemicals.daysUntilExpiry(chemical)
        if (timeUntilExpiry < 30 && timeUntilExpiry > 0) {
            return yellow
        }
        if (timeUntilExpiry <= 0) {
            return red
        }
        return ''
    }


    getSearchObservable(): Observable<string[]> {
        return this.searchControl.valueChanges.pipe(
            map(search =>
                this.chemicals.getNames(
                    this.getChemicals(),
                    search)
            )
        )
    }

    // set the activated property of all hazards other than the passed hazard to false and clear hazards from the passed chemical
    singleSelect(chemical: Chemical, hazardName: Hazard): Chemical {
        chemical.hazards = [hazardName];
        chemical.hazardList.forEach(hl => {
            if (hl.title !== hazardName) {
                hl.activated = false;
            }
        })

        return chemical
    }


    getHazardPicture(hazard: Hazard): string {
        switch (hazard) {
            case 'Corrosive':
                return 'assets/corrosive.jpg'
            case 'Hazardous to the environment':
                return 'assets/environment.jpg'
            case 'Explosive':
                return 'assets/explosive.jpg'
            case 'Flammable':
                return 'assets/flammable.jpg'
            case 'Gas under pressure':
                return 'assets/gas.jpg'
            case 'Health hazard/Hazardous to the ozone layer':
                return 'assets/health.jpg'
            case 'Oxidising':
                return 'assets/oxidising.jpg'
            case 'Serious health hazard':
                return 'assets/serious.jpg'
            case 'Acute toxicity':
                return 'assets/toxic.jpg'
            case 'None':
                return 'assets/non-hazardous.jpg'
            default:
                return 'assets/unknown.jpg'
        }
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

}
