import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ActivitiesRetrieverService} from "./services/activities-retriever/activities-retriever.service";
import {ActivityTableComponent} from "./components/activity-table/activity-table.component";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {LoginComponent} from "./components/login/login.component";
import {LoadComponent} from "./components/activity-table/load/load.component";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('AppComponent', () => {
  let activitiesRetrieverService: ActivitiesRetrieverService;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        MatTableModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatInputModule
      ],
      declarations: [
        AppComponent,
        LoginComponent,
        ActivityTableComponent,
        LoadComponent
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

  it('shall show home if active', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.isHomeHidden).toBeFalse();

    spyOnProperty(window, 'innerWidth').and.returnValue(10);
    spyOnProperty(window, 'innerHeight').and.returnValue(20);
    window.dispatchEvent(new Event('resize'));
    expect(app.isHomeHidden).toBeTrue();
  })

  it('shall hide home if inactive', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.isHomeHidden).toBeFalse();

    spyOnProperty(window, 'innerWidth').and.returnValue(20);
    spyOnProperty(window, 'innerHeight').and.returnValue(10);
    window.dispatchEvent(new Event('resize'));
    expect(app.isHomeHidden).toBeFalse();
  })

  it('shall hide home if inactive', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.isHomeHidden).toBeFalse();

    spyOnProperty(window, 'innerWidth').and.returnValue(20);
    spyOnProperty(window, 'innerHeight').and.returnValue(10);
    app.ngOnInit();
    expect(app.isHomeHidden).toBeFalse();
  })
});
