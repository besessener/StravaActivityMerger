import {Component} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {ActivitiesRetrieverService} from "./activities-retriever-service/activities-retriever.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Activity Merger';
  tokenAvailable: boolean = false;
  codeAvailable: boolean = false;
  activities: any = [];

  constructor(private _route: ActivatedRoute, public activitiesRetrieverService: ActivitiesRetrieverService) {
    let loadedToken = localStorage.getItem('token')
    console.info(loadedToken)
    this.tokenAvailable = loadedToken != null
    if (loadedToken) {
      activitiesRetrieverService.activities.subscribe(activities => {
        this.setActivityData(activities);
      })
      activitiesRetrieverService.getActivitiesWithToken(loadedToken)
    }

    _route.queryParams.subscribe( (params: Params) => {
      if (params.code) {
        this.codeAvailable = true;
        activitiesRetrieverService.getActivitiesWithCode(params.code).subscribe(activities => {
          this.setActivityData(activities);
        })
      } else {
        this.codeAvailable = false;
      }
    })
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
