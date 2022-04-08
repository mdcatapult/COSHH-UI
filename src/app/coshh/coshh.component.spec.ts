import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoshhComponent } from './coshh.component';

describe('CoshhComponent', () => {
  let component: CoshhComponent;
  let fixture: ComponentFixture<CoshhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoshhComponent ]
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
