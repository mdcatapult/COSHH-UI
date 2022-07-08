import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {allHazards, Chemical, columnTypes, ExpiryColor, Hazard, HazardListItem, red, yellow} from './types';
import {MatTableDataSource} from '@angular/material/table';
import {UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
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

    expiryFilterControl = new UntypedFormControl('Any')
    expiryFilterValues = ['Any', '< 30 Days', 'Expired']

    searchOptions: Observable<string[]> = new Observable()
    searchControl = new UntypedFormControl()

    formGroup = new UntypedFormGroup({}) // form group for table
    formArray = new UntypedFormArray([]) // form array for table rows


    ngOnInit(): void {

        this.http.get<Array<Chemical>>(`${environment.backendUrl}/chemicals`)
            .subscribe((res: Array<Chemical>) => {

                res = res?.map((chem: Chemical) => {
                    chem.backgroundColour = this.getExpiryColour(chem)
                    chem.hazardList = this.getHazardListForChemical(chem)
                    return chem
                })

                this.chemicals.set(res || [])
                const inStock = this.chemicals.get(
                    this.toggleArchiveControl.value,
                    this.hazardFilterControl.value,
                    this.labFilterControl.value,
                    this.expiryFilterControl.value
                )
                this.tableData = new MatTableDataSource<Chemical>(inStock)

                inStock.forEach(chem => this.addChemicalForm(chem))

                this.searchOptions = this.getSearchObservable()

            })

        this.http.get<string[]>(`${environment.backendUrl}/labs`).subscribe(labs => {
            this.labFilterValues = labs.concat('All')
            this.labFilterControl.setValue('All')
        })

        this.formGroup = this.fb.group({
            chemicals: this.formArray
        })


        this.searchControl.valueChanges.subscribe((value: string) => {

            this.tableData.data = value === '' ?
                this.chemicals.get(
                    this.toggleArchiveControl.value,
                    this.hazardFilterControl.value,
                    this.labFilterControl.value,
                    this.expiryFilterControl.value,
                ) :
                this.tableData.data.filter(chemical => chemical.name.toLowerCase().includes(value.toLowerCase()))


            this.formArray.clear()
            this.tableData.data.forEach(chem => this.addChemicalForm(chem))
        })

        combineLatest([
                this.hazardFilterControl,
                this.labFilterControl,
                this.expiryFilterControl,
                this.toggleArchiveControl
            ].map(control => control.valueChanges.pipe(startWith(control.value)))
        ).subscribe(() => {
            this.refresh()

            this.formArray.clear()
            this.tableData.data.forEach(chem => this.addChemicalForm(chem))
            this.searchOptions = this.getSearchObservable()
        })

    }


    archive(chemical: Chemical): void {
        chemical.isArchived = true
        this.updateChemical(chemical)

        this.refresh()
    }

    refresh(): void {
        this.tableData.data = this.chemicals.get(
            this.toggleArchiveControl.value,
            this.hazardFilterControl.value,
            this.labFilterControl.value,
            this.expiryFilterControl.value,
        )
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
        ).subscribe(() => {})
    }

    onChemicalAdded(chemical: Chemical): void {
        this.http.post<Chemical>(`${environment.backendUrl}/chemical`, chemical).subscribe((addedChemical: Chemical) => {
            addedChemical.hazardList = this.getHazardListForChemical(addedChemical)
            addedChemical.backgroundColour = this.getExpiryColour(chemical)
            this.chemicals.add(addedChemical)
            this.tableData.data = this.tableData.data.concat([addedChemical])
            this.addChemicalForm(addedChemical)
            this.searchOptions = this.getSearchObservable()
            this.refresh()
        })
    }

    addChemicalForm(chemical: Chemical): void {
        const formGroup = this.fb.group({
            casNumber: [chemical.casNumber],
            name: [chemical.name, Validators.required],
            photoPath: [chemical.photoPath],
            matterState: [chemical.matterState],
            quantity: [chemical.quantity],
            added: [chemical.added],
            expiry: [chemical.expiry],
            safetyDataSheet: [chemical.safetyDataSheet],
            coshhLink: [chemical.coshhLink],
            storageTemp: [chemical.storageTemp],
            location: [chemical.location],
        })

        formGroup.valueChanges.subscribe(changedChemical => {
            changedChemical.id = chemical.id
            this.updateChemical(changedChemical, changedChemical.expiry !== chemical.expiry)
            chemical.backgroundColour = this.getExpiryColour(changedChemical)
        })

        this.formArray.push(formGroup)
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
                    this.toggleArchiveControl.value,
                    this.hazardFilterControl.value,
                    search,
                    this.labFilterControl.value,
                    this.expiryFilterControl.value
                )
            )
        )
    }


    onHazardSelect(chemical: Chemical, event: MatCheckboxChange) {

        const checkedHazard = event.source._elementRef.nativeElement.innerText
        const notHazardous = chemical.hazardList.filter(hazardListItem => hazardListItem.value === 'None')[0]

        // if 'None' has been selected, set the activated property of all other hazards to false
        if (notHazardous.activated && checkedHazard === 'None') {
            chemical.hazardList.forEach(hl => {
                if (hl.title !== 'None') {
                    hl.activated = false;
                }
            })
        } else {

            // if any hazard has been selected, set the activated property of the 'None' hazard to false
            chemical.hazardList.filter(hazardListItem => hazardListItem.value === 'None')
                .map(hazardListItem => hazardListItem.activated = false)

            // set hazards on the chemical to be those the user has selected via the checkboxes
            chemical.hazards = chemical.hazardList
                .filter(hazard => hazard.activated)
                .map((hazard: HazardListItem) => hazard.title)

            // update the chemical in the database
            this.updateHazards(chemical)
        }
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
