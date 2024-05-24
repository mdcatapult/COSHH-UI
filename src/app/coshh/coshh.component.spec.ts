import { AuthModule } from '@auth0/auth0-angular';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { UntypedFormBuilder } from '@angular/forms';

import { CoshhComponent } from './coshh.component';
import { HazardService } from '../services/hazard.service';
import { SaveService } from '../services/save.service';

describe('CoshhComponent', () => {
    let component: CoshhComponent;

    let fixture: ComponentFixture<CoshhComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CoshhComponent],
            providers: [
                HazardService,
                HttpClient,
                HttpHandler,
                SaveService,
                UntypedFormBuilder
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
