import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ActivityTableComponent} from './activity-table.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {Directive, Input} from "@angular/core";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

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
});
