import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { CoshhComponent } from './coshh.component';

describe('CoshhComponent', () => {
  let component: CoshhComponent;
  let fixture: ComponentFixture<CoshhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoshhComponent ],
      providers: [
        HttpClient,
        HttpHandler,
        FormBuilder,
      ],
      imports: [
        MatAutocompleteModule,
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
