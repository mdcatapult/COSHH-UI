import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog, MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { Overlay } from '@angular/cdk/overlay';

import { EditChemicalComponent } from './edit-chemical.component';

describe('EditChemicalComponent', () => {
  let component: EditChemicalComponent;

  let fixture: ComponentFixture<EditChemicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditChemicalComponent ],
      providers: [
        MatDialog,
        Overlay
      ],
      imports: [MatDialogModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChemicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
