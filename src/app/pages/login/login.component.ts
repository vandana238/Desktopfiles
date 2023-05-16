import { Component, OnInit } from '@angular/core';

import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
// import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  constructor(private oauthService: OAuthService) { }

  ngOnInit(): void {
  }

  attemptLogin(){

    console.log("Initializing the implicit flow")
    this.oauthService.initImplicitFlow();
  }
//api service
  getAuthToken(){

    console.log("getting auth token");
    console.log(this.oauthService.getAccessToken());
  }


}
