import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  STRAVA_AUTH_URL: any;

  constructor() {
    let STRAVA_BASE_URL = 'http://www.strava.com/';
    let STRAVA_REDIRECT_URL = location.href;
    let client_id = "66715";
    this.STRAVA_AUTH_URL = STRAVA_BASE_URL + 'oauth/authorize?client_id=' + client_id + '&approval_prompt=force&scope=activity:read_all&response_type=code&redirect_uri=' + STRAVA_REDIRECT_URL;
  }
}
