import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ActivitiesRetrieverService} from "./services/activities-retriever/activities-retriever.service";
import {Activity} from "./components/activity-table/activity-table.component";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {LoginComponent} from "./components/login/login.component";

describe('AppComponent', () => {
  let activitiesRetrieverService: ActivitiesRetrieverService;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([])
      ],
      declarations: [
        AppComponent,
        LoginComponent
      ],
    }).compileComponents();

    activitiesRetrieverService = TestBed.inject(ActivitiesRetrieverService);
    route = TestBed.inject(ActivatedRoute);
    route.queryParams = new BehaviorSubject<any>({});
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
    fixture.detectChanges();

    activitiesRetrieverService.token.next('123');
    tick(1);

    let data: Activity[] = [{
      id: 1,
      type: 'ride',
      name: 'afternoon ride',
      date: '1-July-2021',
      elapsedTime: '10 seconds',
      timeInSeconds: 0
    }];
    activitiesRetrieverService.activities.next(data);
    tick(1);
    expect(app.tokenAvailable).toBeTrue();
    expect(app.codeAvailable).toBeFalse();

    app.tokenAvailable = true;
    app.codeAvailable = true;
    activitiesRetrieverService.activities.next({message: 'test'});
    tick(1);
    expect(app.tokenAvailable).toBeFalse();
    expect(app.codeAvailable).toBeFalse();
  }))

  it('params subsription', fakeAsync(() => {
    localStorage.clear();
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    let params = new BehaviorSubject<any>({});
    route.queryParams = params;
    fixture.detectChanges();

    app.codeAvailable = false;
    params.next({code: '123'});
    tick(1);
    expect(app.codeAvailable).toBeTrue();

    app.codeAvailable = false;
    app.loadedToken = 'token';
    params.next({code: '123'});
    tick(1);
    expect(app.codeAvailable).toBeTrue();

    app.codeAvailable = true;
    params.next({});
    tick(1);
    expect(app.codeAvailable).toBeFalse();
  }))

  it('getVisibleComponent should give corerct component name', () => {
    localStorage.clear();
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app.getVisibleComponent()).toEqual('login');

    app.tokenAvailable = true;
    app.codeAvailable = true;
    expect(app.getVisibleComponent()).toEqual('activity-table');

    app.tokenAvailable = true;
    app.codeAvailable = false;
    expect(app.getVisibleComponent()).toEqual('activity-table');

    app.tokenAvailable = false;
    app.codeAvailable = true;
    expect(app.getVisibleComponent()).toEqual('activity-table');
  })
});
