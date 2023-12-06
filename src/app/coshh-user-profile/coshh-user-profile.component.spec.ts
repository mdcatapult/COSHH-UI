import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthModule } from '@auth0/auth0-angular';
import { CoshhUserProfileComponent } from './coshh-user-profile.component';


describe('CoshhUserProfileComponent', () => {
  let component: CoshhUserProfileComponent;

  let fixture: ComponentFixture<CoshhUserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoshhUserProfileComponent ],
      imports: [
        AuthModule.forRoot({
          domain: 'mdcatapult.eu.auth0.com',
          clientId: 'kGE0VDjHYDaQvx977nCCe8e4GJbCfi41'
        })
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(CoshhUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the getUserProfile Details', () => {
    expect(component.getUserProfileDetails).toBeDefined();
  });

});
