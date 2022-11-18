import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {allHazards, Chemical, columnTypes, ExpiryColor, Hazard, HazardListItem, red, yellow} from './types';
import {MatTableDataSource} from '@angular/material/table';
import {
    UntypedFormBuilder,
    UntypedFormControl,
} from "@angular/forms";
import {combineLatest, debounceTime, map, Observable, startWith} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Chemicals} from './chemicals';
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
    selector: 'app-coshh',
    templateUrl: './coshh.component.html',
    styleUrls: ['./coshh.component.scss']
})
export class CoshhComponent implements OnInit {

    constructor(private http: HttpClient, private fb: UntypedFormBuilder) {
    }

    chemicals = new Chemicals() // this represents all the chemicals returned from the API
    cupboards: String[] = [];
    labs: String[] = [];
    projects: {} = {};
    projectSpecific: string[] = [];
    freezeColumns = false;
    displayedColumns = ["casNumber", "name", "hazards", "location", "cupboard", "chemicalNumber", "matterState", "quantity", "added", "Expiry", "safetyDataSheet", "coshhLink", "storageTemp", "projectSpecific", "archive"]

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

    searchOptions: Observable<string[]> = new Observable()
    searchControl = new UntypedFormControl()

    updateCupboardsFilterList = () => {  // TODO add trigger on data change
        this.http.get<string[]>(`${environment.backendUrl}/cupboards`).subscribe(cupboards => {
            this.cupboardFilterValues = cupboards.concat('All')
            this.cupboards = cupboards
        })
    }

    getChemicals = () => {
        return this.chemicals.get(
            this.toggleArchiveControl.value,
            this.cupboardFilterControl.value,
            this.hazardFilterControl.value,
            this.labFilterControl.value,
            this.expiryFilterControl.value
        )
    }

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

                this.searchOptions = this.getSearchObservable()

            })

        this.http.get<string[]>(`${environment.backendUrl}/labs`).subscribe(labs => {
            this.labFilterValues = labs.concat('All')
            this.labFilterControl.setValue('All')
            this.labs = labs
        })

        this.http.get<string[][]>(`${environment.backendUrl}/projects`).subscribe(projects => {


            this.projectSpecific = projects.reduce((projectsArray: string[], currentValue: string[], currentIndex) => {
                const projectCode = currentValue[0]
                const projectName = currentValue[1]
                // strip out header row and any blank rows
                if (currentIndex > 0 && projectCode && projectName) {
                    projectsArray.push(`${projectCode} - ${projectName}`)
                }

                return projectsArray
            }, [])

        })

        this.searchControl.valueChanges.subscribe((value: string) => {

            this.tableData.data = value === '' ?
                this.getChemicals() :
                this.tableData.data.filter(chemical => chemical.name.toLowerCase().includes(value.toLowerCase()))
        })

        combineLatest([
                this.hazardFilterControl,
                this.cupboardFilterControl,
                this.labFilterControl,
                this.expiryFilterControl,
                this.toggleArchiveControl
            ].map(control => control.valueChanges.pipe(startWith(control.value)))
        ).subscribe(() => {
            this.refresh()
            this.searchOptions = this.getSearchObservable()
        })

    }


    archive(chemical: Chemical): void {
        chemical.isArchived = true
        this.updateChemical(chemical)

        this.refresh()
    }

    refresh(): void {
        this.tableData.data = this.getChemicals()
        this.updateCupboardsFilterList()
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

    onChemicalAdded(chemical: Chemical): void {
        this.http.post<Chemical>(`${environment.backendUrl}/chemical`, chemical).subscribe((addedChemical: Chemical) => {
            addedChemical.editSDS = false
            addedChemical.editCoshh = false
            addedChemical.hazardList = this.getHazardListForChemical(addedChemical)
            addedChemical.backgroundColour = this.getExpiryColour(chemical)
            this.chemicals.add(addedChemical)
            // this.tableData.data = this.tableData.data.concat([addedChemical])
            this.refresh()
            this.searchOptions = this.getSearchObservable()
        })
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

    onHazardSelect(chemical: Chemical, event: MatCheckboxChange) {

        const checkedHazard = event.source._elementRef.nativeElement.innerText.trim()
        const notHazardous = chemical.hazardList.filter(hazardListItem => hazardListItem.value === 'None')[0]
        const unknown = chemical.hazardList.filter(hazardListItem => hazardListItem.value === 'Unknown')[0]

        // if 'None' or 'Unknown' has been selected, set the activated property of all other hazards to false and clear hazards
        if ((notHazardous.activated && checkedHazard === 'None') || (unknown.activated && checkedHazard === 'Unknown')) {
            this.singleSelect(chemical, checkedHazard)
        } else {
            // if any hazard has been selected, set the activated property of the 'None' hazard to false
            chemical.hazardList.filter(hazardListItem => (hazardListItem.value === 'None' || hazardListItem.value === 'Unknown'))
                .map(hazardListItem => hazardListItem.activated = false)

            // set hazards on the chemical to be those the user has selected via the checkboxes
            chemical.hazards = chemical.hazardList.reduce((hazardList: Hazard[], hazard: HazardListItem) => {
                return hazard.activated ? hazardList.concat(hazard.title) : hazardList
            }, [])
        }

        // update the chemical in the database
        this.updateHazards(chemical)
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


}
