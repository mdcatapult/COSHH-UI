import { AuthModule } from '@auth0/auth0-angular';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { UntypedFormBuilder } from '@angular/forms';

import { CoshhComponent } from './coshh.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SaveService } from '../services/save-service.service';
import { HazardService } from '../services/hazard-service.service';

describe('CoshhComponent', () => {
    let component: CoshhComponent;

    let fixture: ComponentFixture<CoshhComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CoshhComponent],
            providers: [
                HttpClient,
                HttpHandler,
                MatDialog,
                UntypedFormBuilder,
                SaveService,
                HazardService,
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {
                        chemical: { hazards: [] }
                    } }
            ],
            imports: [
                MatAutocompleteModule,
                MatDialogModule,
                MatMenuModule,
                // Fake Auth0 details for testing purposes
                AuthModule.forRoot({
                    domain: 'a.domain.id',
                    clientId: '12345'
                })
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CoshhComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
