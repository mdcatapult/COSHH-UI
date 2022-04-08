import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CoshhComponent } from './coshh/coshh.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from "@angular/material/table";

@NgModule({
  declarations: [
    AppComponent,
    CoshhComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatTableModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
