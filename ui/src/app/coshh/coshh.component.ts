import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chemical, columnTypes} from './types';
import { MatTableDataSource } from '@angular/material/table';
import {FormControl} from "@angular/forms";

@Component({
    selector: 'app-coshh',
    templateUrl: './coshh.component.html',
    styleUrls: ['./coshh.component.sass']
})
export class CoshhComponent implements OnInit {

    constructor(private http: HttpClient) {
    }

    tableData = new MatTableDataSource<Chemical>();
    columns: Array<string> = columnTypes
    allChemicals: Chemical[] = []
    toggleArchiveControl = new FormControl(false)


    ngOnInit(): void {
        this.http.get<Array<Chemical>>('http://localhost:8080/chemicals')
        .subscribe((res: Array<Chemical>) => {
            this.allChemicals = res
            const inStock = this.allChemicals.filter(chemical => !chemical.isArchived)
            this.tableData = new MatTableDataSource<Chemical>(inStock)
        })

        this.toggleArchiveControl.valueChanges.subscribe(includeArchived => {
            this.tableData.data = includeArchived ? this.allChemicals : this.allChemicals.filter(chemical => !chemical.isArchived)
        })
    }

    archive(chemical: Chemical): void {
        chemical.isArchived = true
        this.http.put('http://localhost:8080/chemical', chemical).subscribe()
    }

    onChemicalAdded(chemical: Chemical): void {
        this.http.post('http://localhost:8080/chemical', chemical).subscribe(() => {
            this.tableData.data = this.tableData.data.concat([chemical])
        })
    }

}
