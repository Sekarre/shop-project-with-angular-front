import { Component, OnInit } from '@angular/core';
import {OktaAuthService} from "@okta/okta-angular";

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = "";

  storage: Storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthService) { }

  ngOnInit(): void {

    //Subscribe to auth state changes
    this.oktaAuthService.$authenticationState.subscribe(
      result => {
        this.isAuthenticated = result;
        this.getUserDetails();
      }
    );
  }

  private getUserDetails() {
    if (this.isAuthenticated) {

      //Fetch the logged in user details
      //user full name is exposed as property name
      this.oktaAuthService.getUser().then(
        res => {
          this.userFullName = res.name!;

          //retrieve the user's email from authentication response
          const email = res.email;

          this.storage.setItem('userEmail', JSON.stringify(email));
        }
      );
    }
  }

  logout() {
    //terminate the session with okta and removes current tokens
    this.oktaAuthService.signOut();
  }
}
