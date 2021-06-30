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

  getActivities(code: string) {
    this.tokenService.getToken(code).subscribe( (data: any) => {
      let token = data.token;
      let url = window.location.protocol + '//' + window.location.hostname + ':6001/activityList?token=' + token;
      this._http.get(url).subscribe( (response: any) => {
        this.activities.next(response.activities);
      })
    })

    return this.activities;
  }
}
