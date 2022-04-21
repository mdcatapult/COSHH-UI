import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AddChemicalComponent } from './add-chemical.component';

describe('AddChemicalComponent', () => {
  let component: AddChemicalComponent;
  let fixture: ComponentFixture<AddChemicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddChemicalComponent ],
      providers: [
        MatDialog,
        Overlay,
      ],
      imports: [MatDialogModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChemicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
