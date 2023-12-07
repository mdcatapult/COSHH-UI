import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatNativeDateModule, MatOptionModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';

import { AddChemicalComponent } from './add-chemical/add-chemical.component';
import { AppComponent } from './app.component';
import { ChemicalDialogComponent } from './chemical-dialog/chemical-dialog.component';
import { CloneChemicalComponent } from './clone-chemical/clone-chemical.component';
import { CoshhComponent } from './coshh/coshh.component';
import { DateTimeFormatPipe } from './utility/pipes/my-datetime-format.pipe';
import { EditChemicalComponent } from './edit-chemical/edit-chemical.component';
import { environment as env } from '../environments/environment';
import { NAPipe } from './utility/pipes/na-pipe';
import { ScanChemicalComponent } from './scan-chemical/scan-chemical.component';
import { SharedModule } from './shared';

@NgModule({
    declarations: [
        AddChemicalComponent,
        AppComponent,
        CloneChemicalComponent,
        CoshhComponent,
        EditChemicalComponent,
        ChemicalDialogComponent,
        DateTimeFormatPipe,
        NAPipe,
        ScanChemicalComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatBadgeModule,
        MatTableModule,
        MatIconModule,
        MatDialogModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        MatCheckboxModule,
        MatSortModule,
        MatToolbarModule,
        MatTooltipModule,
        MatOptionModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatMenuModule,
        MatSelectModule,
        AuthModule.forRoot({
            ...env.auth0,
            httpInterceptor: {
                allowedList: [`${env.backendUrl}/chemical`, `${env.backendUrl}/hazards`]
            }
        }),
        SharedModule
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthHttpInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
