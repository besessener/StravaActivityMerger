import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ActivitiesRetrieverService} from "./services/activities-retriever/activities-retriever.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Activity Merger';

  loadedToken: string| null = '';
  tokenAvailable: boolean = false;
  codeAvailable: boolean = false;
  auth: boolean = false;

  activities: any = [];

  constructor(public route: ActivatedRoute, public activitiesRetrieverService: ActivitiesRetrieverService, private _router: Router) {
  }

  ngOnInit(): void {
    this.loadedToken = localStorage.getItem('token')
    this.tokenAvailable = this.loadedToken != null && this.loadedToken != ''

    this.activitiesRetrieverService.activities.subscribe(activities => {
      this.setActivityData(activities);
    })

    this.activitiesRetrieverService.token.subscribe(token => {
      if (token) {
        localStorage.setItem('token', token);
        this.activitiesRetrieverService.setActivitiesWithToken(token);
      }
    })

    this.route.queryParams.subscribe((params: Params) => {
      this.onQueryParamChanged(params)
    });

    if (this.loadedToken) {
      this.activitiesRetrieverService.token.next(this.loadedToken);
    }
  }

  private onQueryParamChanged(params: Params) {
    if (params.code) {
      this.codeAvailable = true;
      if (!this.loadedToken) {
        this.activitiesRetrieverService.setTokenFromCode(params.code);
        this._router.navigate(['/'], {queryParams: {auth: true}});
      }
    } else if (params.refresh){
      let token = localStorage.getItem('token');
      this.activitiesRetrieverService.setActivitiesWithToken(token ? token : '')
    } else if(params.auth) {
      this.auth = true;
    } else {
      this.codeAvailable = false;
      this.auth = false;
    }
  }

  private setActivityData<T>(activities: T) {
    this.activities = activities;
    if (this.activities.message) {
      localStorage.clear();
      this._router.navigate(['/'], {queryParams: {error: encodeURIComponent(this.activities.message)}});
      this.tokenAvailable = false;
      this.codeAvailable = false;
    } else if (this.activities.length > 0) {
      this.tokenAvailable = true;
    }
  }

  public getVisibleComponent() {
    if (this.tokenAvailable || this.codeAvailable || this.auth) {
      return 'activity-table';
    }

    return 'login';
  }
}
