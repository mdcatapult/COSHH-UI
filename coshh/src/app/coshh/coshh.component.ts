import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-coshh',
  templateUrl: './coshh.component.html',
  styleUrls: ['./coshh.component.sass']
})
export class CoshhComponent implements OnInit {

  constructor(private http: HttpClient) { }

  coshh: any

  ngOnInit(): void {
    this.http.get('http://localhost:8080/coshh').subscribe(res => this.coshh = JSON.stringify(res))
  }

}
