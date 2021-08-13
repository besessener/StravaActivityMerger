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

  isHomeHidden: boolean = false;

  constructor(private _router: Router) {
    window.onresize = (e) =>
    {
      this.setHomeTextVisible();
    };
  }

  ngOnInit(): void {
    this.setHomeTextVisible();
  }

  public setHomeTextVisible() {
    if (window.innerWidth < window.innerHeight) {
      this.isHomeHidden = true;
    } else {
      this.isHomeHidden = false;
    }
  }
}
