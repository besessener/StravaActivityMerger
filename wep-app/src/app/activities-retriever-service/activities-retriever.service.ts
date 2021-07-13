import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenService} from "../token-service/token.service";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ActivitiesRetrieverService {

  public activities = new Subject();

  constructor(private _http: HttpClient, private tokenService: TokenService) { }

  getActivitiesWithCode(code: string) {
    let token = localStorage.getItem('token')
    if (!token) {
      this.tokenService.getToken(code).subscribe( (data: any) => {
        localStorage.setItem('token', data.token);
        this.getActivitiesWithToken(data.token)
      })
    } else {
      this.getActivitiesWithToken(token);
    }

    return this.activities;
  }

  getActivitiesWithToken(token: string) {
    let url = window.location.protocol + '//' + window.location.hostname + ':6001/activityList?token=' + token;
    this._http.get(url).subscribe( (response: any) => {
      this.activities.next(response);
    })
  }
}
