import {Component, Input} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BackendService} from "../../services/backend/backend.service";
import {SelectionModel} from "@angular/cdk/collections";
import {Router} from "@angular/router";
import {ActivitiesRetrieverService} from "../../services/activities-retriever/activities-retriever.service";

/**
 * @title Table with expandable rows
 */
@Component({
  selector: 'activity-table-component',
  styleUrls: ['activity-table.component.scss'],
  templateUrl: 'activity-table.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ActivityTableComponent {
  dataSource: any[] = [];
  columnsToDisplay = ['select', 'id', 'type', 'name', 'date', 'elapsedTime'];

  expandedElement: Activity | null = null;
  key: string = '';

  loading: boolean = true;
  allElementsLoaded: boolean = false;

  selection = new SelectionModel<Activity>(true, []);

  numberOfRows = 30;

  @Input() set activities(value: any[]) {
    this.setActivities(value);
  }

  setActivities(value: any[]) {
    this.dataSource = value;
    this.dataSource.forEach(item => {
      item['date'] = item['startDateLocal']['year'] + '-' + item['startDateLocal']['month'] + '-' + item['startDateLocal']['dayOfMonth'];

      const startDate = new Date(item['startDateLocal']['year'], item['startDateLocal']['monthValue'] - 1, item['startDateLocal']['dayOfMonth'], item['startDateLocal']['hour'], item['startDateLocal']['minute'], item['startDateLocal']['second'])
      const secondsSinceEpoch = Math.round(startDate.getTime() / 1000) - 31; // trick stravas duplicate detection
      item['timeInSeconds'] = secondsSinceEpoch;

      item['distance'] = this.meterToKilometer(item['distance'])
      item['totalElevationGain'] = this.meterToKilometer(item['totalElevationGain'])
      item['elevHigh'] = this.meterToKilometer(item['elevHigh'])
      item['elevLow'] = this.meterToKilometer(item['elevLow'])

      item['movingTime'] = this.secondsToHms(item['movingTime']);
      item['elapsedTime'] = this.secondsToHms(item['elapsedTime']);
    })

    this.waitForDom()
  }

  meterToKilometer(str: string) {
    if (parseFloat(str) > 1000) {
      return (parseFloat(str) / 1000) + ' km';
    }

    return str + ' m';
  }

  secondsToHms(str: string) {
    let d = Number(str);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    let hDisplay = h > 0 ? h + (h == 1 ? " hour" : " hours") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    let time = [];
    if(hDisplay) time.push(hDisplay);
    if(mDisplay) time.push(mDisplay);
    if(sDisplay) time.push(sDisplay);
    return time.join(', ');
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => {
        this.selection.select(row)
      });
  }

  constructor(private backendService: BackendService, private activitiesRetriever: ActivitiesRetrieverService, private _router: Router) {
    backendService.getApiKey().subscribe((data: any) => {
      this.key = data.key;
    })
  }

  mergeButtonClicked() {
    this.loading = true;
    let token = localStorage.getItem('token');

    let mergeItems: any = {}
    this.selection.selected.forEach(activity => {
      mergeItems[activity.id.toString()] = activity.timeInSeconds
    })

    let activityDataToPost = {
      token: token,
      mergeItems: mergeItems
    };

    this.backendService.mergeActivities(activityDataToPost).subscribe(() => {
      this.selection = new SelectionModel<Activity>(true, []);
      this._router.navigate(['/'], { queryParams: {refresh: Math.random()} });
      this.waitForDom();
    })
  }

  waitForDom() {
    setTimeout(() => {
      if (!this.allElementsLoaded) {
        this.allElementsLoaded = document.getElementsByClassName('countable').length == this.numberOfRows
        this.waitForDom()
      } else {
        this.loading = false;
      }
    }, 500);
  }

  isMerged(element: any) {
    if (element.externalId) {
      return element.externalId.includes('merged_activity_gpx_');
    }

    return false;
  }
}

export interface Activity {
  id: number;
  type: string;
  name: string;
  date: string;
  elapsedTime: string;
  timeInSeconds: number;
}
