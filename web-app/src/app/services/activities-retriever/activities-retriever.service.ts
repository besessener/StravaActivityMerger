import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BackendService} from "../backend/backend.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ActivitiesRetrieverService {

  public activities = new BehaviorSubject<any>([]);
  public token = new BehaviorSubject<string>('');

  constructor(private _http: HttpClient, private backendService: BackendService) {
  }

  setTokenFromCode(code: string) {
    this.backendService.getToken(code).subscribe((data: any) => {
      this.token.next(data.token);
    });
  }

  setActivitiesWithToken(token: string) {
    this.backendService.getActivities(token).subscribe((response: any) => {
      this.activities.next(response);
    })
  }
}
