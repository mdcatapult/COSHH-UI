import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChemicalDialogComponent } from './add-chemical-dialog.component';

describe('AddChemicalDialogComponent', () => {
  let component: AddChemicalDialogComponent;
  let fixture: ComponentFixture<AddChemicalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddChemicalDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChemicalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
