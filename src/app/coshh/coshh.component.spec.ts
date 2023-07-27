import {HttpClient, HttpHandler} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UntypedFormBuilder} from '@angular/forms';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {CoshhComponent} from './coshh.component';
import {AuthModule} from "@auth0/auth0-angular";
import {MatMenuModule} from "@angular/material/menu";

describe('CoshhComponent', () => {
    let component: CoshhComponent;
    let fixture: ComponentFixture<CoshhComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CoshhComponent],
            providers: [
                HttpClient,
                HttpHandler,
                UntypedFormBuilder,
            ],
            imports: [
                MatAutocompleteModule,
                MatMenuModule,
                // Fake Auth0 details for testing purposes
                AuthModule.forRoot({
                    domain: 'a.domain.id',
                    clientId: '12345',
                }),
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
