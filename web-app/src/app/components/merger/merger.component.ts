import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'merger-component',
  templateUrl: './merger.component.html',
  styleUrls: ['./merger.component.scss']
})
export class MergerComponent implements OnInit {
  mergeIds: Number[] = [];

  constructor(private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      if (params.mergeIds) {
        this.mergeIds = params.mergeIds.split(',').map((id: string) => {
          return parseInt(id);
        })
      }
    })
  }
}
