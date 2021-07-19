import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ActivitiesRetrieverService} from "./services/activities-retriever/activities-retriever.service";
import {Activity} from "./components/activity-table/activity-table.component";

describe('AppComponent', () => {
  let activitiesRetrieverService: ActivitiesRetrieverService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();

    activitiesRetrieverService = TestBed.inject(ActivitiesRetrieverService);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Activity Merger');
  });

  it('activities subsription', fakeAsync(() => {
    localStorage.clear();
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.tokenAvailable = false;
    app.codeAvailable = false;

    let data: Activity = {id: 1, type: 'ride', name: 'afternoon ride', date: '1-July-2021', elapsedTime: '10 seconds'};
    activitiesRetrieverService.activities.next(data);

    tick(1);

    expect(app.tokenAvailable).toBeTrue();
    expect(app.codeAvailable).toBeFalse();
  }))
});
