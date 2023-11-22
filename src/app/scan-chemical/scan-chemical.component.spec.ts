import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanChemicalComponent } from './scan-chemical.component';

describe('ScanChemicalComponent', () => {
  let component: ScanChemicalComponent;
  let fixture: ComponentFixture<ScanChemicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanChemicalComponent ]
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
