import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
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
