import {Component} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Activity Merger';
  code: string = '';

  constructor(private _route: ActivatedRoute) {
    _route.queryParams.subscribe( (params: Params) => {
      if (params.code) {
        this.code = params.code;
      }
    })
  }
}
