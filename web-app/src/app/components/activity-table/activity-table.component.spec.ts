import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ActivityTableComponent} from './activity-table.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";

describe('ActivityTableComponent', () => {
  let component: ActivityTableComponent;
  let fixture: ComponentFixture<ActivityTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatTableModule,
        MatCheckboxModule
      ],
      declarations: [ActivityTableComponent]
    })
      .compileComponents();
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
    console.log(component.isAllSelected());
    expect(component.isAllSelected()).toBeTrue(); // no data, nothing selected
    // component.masterToggle();
    // expect(component.isAllSelected).toEqual(true);
    // component.masterToggle();
    // expect(component.isAllSelected).toEqual(false);
  })
});
