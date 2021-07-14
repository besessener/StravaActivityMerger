import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: string = ''

  constructor(private _http: HttpClient) {
  }

  getToken(code: string) {
    let url = window.location.protocol + '//' + window.location.hostname + ':6001/exchangeToken?code=' + code;
    return this._http.get(url)
  }

  getApiKey() {
    let url = window.location.protocol + '//' + window.location.hostname + ':6001/googleApiToken';
    return this._http.get(url)
  }
}
