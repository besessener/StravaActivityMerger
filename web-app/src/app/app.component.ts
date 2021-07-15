import {Component} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {ActivitiesRetrieverService} from "./services/activities-retriever/activities-retriever.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Activity Merger';

  loadedToken: string = '';
  tokenAvailable: boolean = false;
  codeAvailable: boolean = false;

  activities: any = [];

  constructor(private _route: ActivatedRoute, public activitiesRetrieverService: ActivitiesRetrieverService) {
    let loadedToken = localStorage.getItem('token')
    this.tokenAvailable = loadedToken != null

    activitiesRetrieverService.activities.subscribe(activities => {
      this.setActivityData(activities);
    })

    activitiesRetrieverService.token.subscribe(token => {
      localStorage.setItem('token', token);
      activitiesRetrieverService.setActivitiesWithToken(token);
    })

    _route.queryParams.subscribe(this.onQueryParamChanged());

    if (loadedToken) {
      activitiesRetrieverService.token.next(loadedToken);
    }
  }

  private onQueryParamChanged() {
    return (params: Params) => {
      if (params.code) {
        this.codeAvailable = true;
        if (!this.loadedToken) {
          this.activitiesRetrieverService.setTokenFromCode(params.code);
        }
      } else {
        this.codeAvailable = false;
      }
    };
  }

  private setActivityData<T>(activities: T) {
    this.activities = activities;
    if (this.activities.message) {
      localStorage.clear();
      window.location.href = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/?error=' + encodeURIComponent(this.activities.message);
    } else {
      this.tokenAvailable = true;
      this.codeAvailable = false;
    }
  }
}
