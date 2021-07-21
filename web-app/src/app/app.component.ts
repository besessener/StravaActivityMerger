import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {ActivitiesRetrieverService} from "./services/activities-retriever/activities-retriever.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Activity Merger';

  loadedToken: string = '';
  tokenAvailable: boolean = false;
  codeAvailable: boolean = false;

  activities: any = [];
  mergeIds: any = [];

  constructor(public route: ActivatedRoute, public activitiesRetrieverService: ActivitiesRetrieverService) {
  }

  ngOnInit(): void {
    let loadedToken = localStorage.getItem('token')
    this.tokenAvailable = loadedToken != null && loadedToken != ''

    this.activitiesRetrieverService.activities.subscribe(activities => {
      this.setActivityData(activities);
    })

    this.activitiesRetrieverService.token.subscribe(token => {
      if (token) {
        localStorage.setItem('token', token);
        this.activitiesRetrieverService.setActivitiesWithToken(token);
      }
    })

    this.route.queryParams.subscribe((params: Params) => {this.onQueryParamChanged(params)});

    if (loadedToken) {
      this.activitiesRetrieverService.token.next(loadedToken);
    }
  }

  private onQueryParamChanged(params: Params) {
    if (params.code) {
        this.codeAvailable = true;
        if (!this.loadedToken) {
          this.activitiesRetrieverService.setTokenFromCode(params.code);
        }
      } else if (params.mergeIds) {
        this.mergeIds = params.mergeIds.split(',').map(function(item: string) {
          return parseInt(item, 10);
        });
        this.codeAvailable = false;
      } else {
        this.codeAvailable = false;
      }
  }

  private setActivityData<T>(activities: T) {
    this.activities = activities;
    if (this.activities.message) {
      localStorage.clear();
      window.location.href = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/?error=' + encodeURIComponent(this.activities.message);
      this.tokenAvailable = false;
      this.codeAvailable = false;
    } else if (this.activities.length > 0) {
      this.tokenAvailable = true;
    }
  }

  public getVisibleComponent() {
    if (this.tokenAvailable) {
      if (this.mergeIds.length) {
        return 'merger';
      } else {
        if (this.activities.length) {
          return 'activity-table';
        } else {
          if (this.codeAvailable) {
            return 'loading';
          }
        }
      }
    } else {
      if (this.codeAvailable) {
        if (!this.activities.length) {
          return 'loading';
        }
      } else {
        return 'login';
      }
    }

    return '';
  }
}
