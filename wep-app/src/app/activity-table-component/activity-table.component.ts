import {Component, Input} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {TokenService} from "../token-service/token.service";

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
  dataSource : any[] = [];
  columnsToDisplay = ['id', 'type', 'name', 'date', 'elapsedTime'];
  expandedElement: Activity | null;
  key: string = '';
  @Input() set activities(value: any[]) {
    this.dataSource = value;
    this.dataSource.forEach(item => {
      item['date'] = item['startDateLocal']['year'] + '-' + item['startDateLocal']['month'] + '-' + item['startDateLocal']['dayOfMonth'];

      item['distance'] = this.meterToKilometer(item['distance'])
      item['totalElevationGain'] = this.meterToKilometer(item['totalElevationGain'])

      item['movingTime'] = this.secondsToHms(item['movingTime']);
      item['elapsedTime'] = this.secondsToHms(item['elapsedTime']);
    })
  }

  meterToKilometer(str: string) {
    if (parseFloat(str) > 1000) {
      return (parseFloat(str) / 1000) + ' km';
    }

    return str + ' m';
  }

  secondsToHms(str: string) {
    let d = Number(str);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  constructor(private tokenService: TokenService) {
    tokenService.getApiKey().subscribe( (data: any) => {
      this.key = data.key;
    })
  }
}

export interface Activity {
  id: number;
  type: string;
}
