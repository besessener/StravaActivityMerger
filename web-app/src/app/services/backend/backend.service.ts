import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(private _http: HttpClient) {
  }

  baseUrl = window.location.protocol + '//' + window.location.hostname + ':6001/'

  getToken(code: string) {
    let url = this.baseUrl + 'exchangeToken?code=' + code;
    return this._http.get(url)
  }

  getApiKey() {
    let url = this.baseUrl + 'googleApiToken';
    return this._http.get(url)
  }

  getActivities(token: string) {
    let url = this.baseUrl + 'activityList?token=' + token;
    return this._http.get(url)
  }

  mergeActivities(ids: number[], token: string | null) {
    let url = this.baseUrl + 'merge?token=' + token + '&mergeIds=' + ids.join(',');
    return this._http.get(url)
  }
}
