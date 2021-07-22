import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {Activity, ActivityTableComponent} from './activity-table.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {RouterModule} from "@angular/router";
import {LoadComponent} from "./load/load.component";
import {BackendService} from "../../services/backend/backend.service";
import {of} from "rxjs";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

describe('ActivityTableComponent', () => {
  let component: ActivityTableComponent;
  let fixture: ComponentFixture<ActivityTableComponent>;
  let backendService: BackendService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatTableModule,
        MatCheckboxModule,
        RouterModule.forRoot([]),
        MatProgressSpinnerModule
      ],
      declarations: [ActivityTableComponent, LoadComponent]
    })
      .compileComponents();
    backendService = TestBed.inject(BackendService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert distances', () => {
    expect(component.meterToKilometer('123')).toEqual('123 m');
    expect(component.meterToKilometer('1234')).toEqual('1.234 km');
  })

  it('should convert times', () => {
    expect(component.secondsToHms('1')).toEqual('1 second');
    expect(component.secondsToHms('7')).toEqual('7 seconds');
    expect(component.secondsToHms('60')).toEqual('1 minute');
    expect(component.secondsToHms('70')).toEqual('1 minute, 10 seconds');
    expect(component.secondsToHms('700')).toEqual('11 minutes, 40 seconds');
    expect(component.secondsToHms('7000')).toEqual('1 hour, 56 minutes, 40 seconds');
    expect(component.secondsToHms('7200')).toEqual('2 hours');
    expect(component.secondsToHms('7201')).toEqual('2 hours, 1 second');
  })

  it('should return true if number of selected == number of rows', () => {
    expect(component.isAllSelected()).toBeTrue(); // no data, nothing selected

    let data: Activity[] = [
      {id: 1, type: 'ride', name: 'afternoon ride', date: '1-July-2021', elapsedTime: '10 seconds'}
    ];
    component.dataSource = data;

    expect(component.isAllSelected()).toBeFalse();
    component.masterToggle();
    expect(component.isAllSelected()).toBeTrue();
    component.masterToggle();
    expect(component.isAllSelected()).toBeFalse();
  })

  it('should set activities correctly', () => {
    let data: any[] = [
      {
        id: 1,
        type: 'ride',
        name: 'afternoon ride',
        date: '1-July-2021',
        elapsedTime: '10 seconds',
        startDateLocal: {year: '2021', month: '5', dayOfMonth: '15'},
        distance: '500',
        totalElevationGain: '1001',
        elevHigh: '20',
        elevLow: '0',
        movingTime: '1000000'
      }
    ];

    component.setActivities(data);

    expect(component.dataSource[0].date).toEqual('2021-5-15');
    expect(component.dataSource[0].distance).toEqual('500 m');
    expect(component.dataSource[0].movingTime).toEqual('277 hours, 46 minutes, 40 seconds');
  })

  it('merge button click does not fail', fakeAsync(() => {
    let data1: Activity = {id: 1, type: 'ride', name: 'afternoon ride', date: '1-July-2021', elapsedTime: '10 seconds'};
    let data2: Activity = {id: 2, type: 'canoeing', name: 'canoeing', date: '2-July-2021', elapsedTime: '1 hour'};
    component.selection.selected.push(data1);
    component.selection.selected.push(data2);
    spyOn(backendService, "mergeActivities").withArgs([1, 2], '123').and.returnValue(of(''));

    component.loading = true;
    localStorage.setItem('token', '123');
    expect(component.loading).toBeTrue();

    component.mergeButtonClicked();
    tick(1)
    expect(component.loading).toBeFalse();
  }))
});
