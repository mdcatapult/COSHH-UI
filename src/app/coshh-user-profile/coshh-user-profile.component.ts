import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-coshh-user-profile',
  templateUrl: './coshh-user-profile.component.html',
  styleUrls: ['./coshh-user-profile.component.sass']
})


export class CoshhUserProfileComponent implements OnInit {

  ngOnInit(): void {}

  constructor(public auth: AuthService) {}

  // this method gets the user profile details from the auth0 service
  getUserProfileDetails() {
    this.auth.user$.subscribe(
      (profile) => {
        return profile;
      }
    );
  }

}
