import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {allHazards, Chemical, columnTypes, Hazard} from './types';
import { MatTableDataSource } from '@angular/material/table';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { map, Observable, startWith } from 'rxjs';


@Component({
    selector: 'app-coshh',
    templateUrl: './coshh.component.html',
    styleUrls: ['./coshh.component.scss']
})
export class CoshhComponent implements OnInit {

    constructor(private http: HttpClient, private fb: FormBuilder) {
    }

    hazardFilterValues = (<string[]>allHazards()).concat('All')
    tableData = new MatTableDataSource<Chemical>() // data source for table
    columns: string[] = columnTypes // columns to display in table
    allChemicals: Chemical[] = [] // all the chemicals from backend
    toggleArchiveControl = new FormControl(false) 
    hazardFilterControl = new FormControl('')

    searchOptions: Observable<string[]> = new Observable()
    searchControl = new FormControl()

    formGroup = new FormGroup({}) // form group for table
    formArray = new FormArray([]) // form array for table rows

    ngOnInit(): void {
        
        this.http.get<Array<Chemical>>('http://localhost:8080/chemicals')
        .subscribe((res: Array<Chemical>) => {

            this.allChemicals = res
            const inStock = this.allChemicals.filter(chemical => !chemical.isArchived)
            this.tableData = new MatTableDataSource<Chemical>(inStock)

            inStock.forEach(chem => this.addChemicalForm(chem))
            console.log(this.allChemicals)

            this.searchOptions = this.getSearchObservable(this.toggleArchiveControl.value)
            
        })    
        
        this.formGroup = this.fb.group({
            chemicals: this.formArray
        })
        
        this.toggleArchiveControl.valueChanges.subscribe(includeArchived => {
            this.tableData.data = this.filterArchived(this.allChemicals)
            this.formArray.clear()
            this.tableData.data.forEach(chem => this.addChemicalForm(chem))
            this.searchOptions = this.getSearchObservable(includeArchived)
        })

        this.searchControl.valueChanges.subscribe((value: string) => {

            this.tableData.data = value === '' ? 
                this.filterArchived(this.allChemicals) : 
                this.tableData.data.filter(chemical => chemical.name.toLowerCase().includes(value.toLowerCase()))


            this.formArray.clear()
            this.tableData.data.forEach(chem => this.addChemicalForm(chem))
        })

        this.hazardFilterControl.valueChanges.subscribe(hazard => {
            const filtered = this.allChemicals.filter(chem => hazard === 'All' || chem.hazards.includes(hazard))
            this.tableData.data = this.filterArchived(filtered)

            this.formArray.clear()
            this.tableData.data.forEach(chem => this.addChemicalForm(chem))
        })
    }

    filterArchived(chemicals: Chemical[]): Chemical[] {
        return this.toggleArchiveControl.value ? chemicals : chemicals.filter(chemical => !chemical.isArchived)
    }

    archive(chemical: Chemical): void {
        chemical.isArchived = true
        this.updateChemical(chemical)
    }

    updateChemical(chemical: Chemical): void {
        this.http.put('http://localhost:8080/chemical', chemical).subscribe()
    }

    onChemicalAdded(chemical: Chemical): void {
        this.http.post('http://localhost:8080/chemical', chemical).subscribe(() => {
            this.allChemicals.push(chemical)
            this.tableData.data = this.tableData.data.concat([chemical])
            this.addChemicalForm(chemical)
            this.searchOptions = this.getSearchObservable(this.toggleArchiveControl.value)
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

        formGroup.valueChanges.subscribe(chemical => this.updateChemical(chemical))

        this.formArray.push(formGroup)
    }

    getSearchObservable(includeArchived: boolean): Observable<string[]> {
        return this.searchControl.valueChanges.pipe(
            map(option => 
                this.allChemicals
                .filter(chemical => chemical.name.toLowerCase().includes(option.toLowerCase()))
                .filter(chemical => includeArchived || !chemical.isArchived)
                .map(chemical => chemical.name)
            )
        )
    }

    getHazardPicture(hazard: Hazard): string {
        switch(hazard) {
            case 'Corrosive': return 'assets/corrosive.jpg'
            case 'Hazardous to the environment': return 'assets/environment.jpg'
            case 'Explosive': return 'assets/explosive.jpg'
            case 'Flammable': return 'assets/flammable.jpg'
            case 'Gas under pressure': return 'assets/gas.jpg'
            case 'Health hazard/Hazardous to the ozone layer': return 'assets/health.jpg'
            case 'Oxidising': return 'assets/oxidising.jpg'
            case 'Serious health hazard': return 'assets/serious.jpg'
            case 'Acute toxicity': return 'assets/toxic.jpg'
            case 'None': return ''
            default: return ''
        }
    }

}
