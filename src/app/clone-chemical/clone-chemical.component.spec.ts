import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { CloneChemicalComponent } from './clone-chemical.component';

describe('CloneChemicalComponent', () => {
    let component: CloneChemicalComponent;

    let fixture: ComponentFixture<CloneChemicalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CloneChemicalComponent],
            providers: [
                HttpClient,
                HttpHandler
            ],
            imports: [MatDialogModule]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CloneChemicalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
