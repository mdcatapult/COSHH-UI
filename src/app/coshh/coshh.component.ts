import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chemical, columnTypes} from './types';
import {keys} from 'ts-transformer-keys';
import * as moment from "moment";

@Component({
    selector: 'app-coshh',
    templateUrl: './coshh.component.html',
    styleUrls: ['./coshh.component.sass']
})
export class CoshhComponent implements OnInit {

    constructor(private http: HttpClient) {
    }

    chemicals: Array<Chemical> = []
    columns: Array<string> = columnTypes

    ngOnInit(): void {
        this.http.get<Array<Chemical>>('http://localhost:8080/coshh').subscribe((res: Array<Chemical>) => this.chemicals = res)
    }

}
