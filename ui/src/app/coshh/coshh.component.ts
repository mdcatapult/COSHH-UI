import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chemical, columnTypes} from './types';
import { MatTableDataSource } from '@angular/material/table';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { fn } from '@angular/compiler/src/output/output_ast';

@Component({
    selector: 'app-coshh',
    templateUrl: './coshh.component.html',
    styleUrls: ['./coshh.component.sass']
})
export class CoshhComponent implements OnInit {

    constructor(private http: HttpClient, private fb: FormBuilder) {
    }

    tableData = new MatTableDataSource<Chemical>();
    columns: Array<string> = columnTypes
    allChemicals: Chemical[] = []
    toggleArchiveControl = new FormControl(false)

    formGroup = new FormGroup({})
    formArray = new FormArray([])

    ngOnInit(): void {
        this.http.get<Array<Chemical>>('http://localhost:8080/chemicals')
        .subscribe((res: Array<Chemical>) => {
            this.allChemicals = res
            const inStock = this.allChemicals.filter(chemical => !chemical.isArchived)
            this.tableData = new MatTableDataSource<Chemical>(inStock)

            this.allChemicals.forEach(chem => {


                const formGroup = this.fb.group({
                    casNumber: [chem.casNumber],
                    chemicalName: [chem.chemicalName, Validators.required],
                    photoPath: [chem.photoPath],
                    matterState: [chem.matterState],
                    quantity: [chem.quantity],
                    added: [chem.added],
                    expiry: [chem.expiry],
                    safetyDataSheet: [chem.safetyDataSheet],
                    coshhLink: [chem.coshhLink],
                    storageTemp: [chem.storageTemp],
                    location: [chem.location],
                })

                formGroup.valueChanges.subscribe(chem => this.updateChemical(chem))

                this.formArray.push(formGroup)
            })
        })

        this.formGroup = this.fb.group({
            chemicals:this.formArray
        })

        this.toggleArchiveControl.valueChanges.subscribe(includeArchived => {
            this.tableData.data = includeArchived ? this.allChemicals : this.allChemicals.filter(chemical => !chemical.isArchived)
        })
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
            this.tableData.data = this.tableData.data.concat([chemical])
        })
    }

}
