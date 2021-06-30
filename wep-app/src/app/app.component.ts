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
  activities: any;

  constructor(private _route: ActivatedRoute, public activitiesRetrieverService: ActivitiesRetrieverService) {
    _route.queryParams.subscribe( (params: Params) => {
      if (params.code) {
        activitiesRetrieverService.getActivities(params.code).subscribe( activities => {
          this.activities = activities;
          this.tokenAvailable = true;
        })
      }
    })
  }
}
