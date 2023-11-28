import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { ScanChemicalComponent } from './scan-chemical.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ScanChemicalComponent', () => {
  let component: ScanChemicalComponent;

  let fixture: ComponentFixture<ScanChemicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanChemicalComponent ],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: MAT_DIALOG_DATA, useValue: {
            chemical: { hazards: [] }
          } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanChemicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
