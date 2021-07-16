import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {RouterTestingModule} from "@angular/router/testing";
import {BehaviorSubject, of} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let activatedRouteStub: MockActivatedRoute;

  beforeEach(async () => {
    activatedRouteStub = new MockActivatedRoute();
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [LoginComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test intial message', () => {
    it('should contain "This page"', () => {
      expect(component.displayMessage).toContain('This page');
      expect(component.displayMessage).toEqual(component.message);
    });

    it('add ?error= query param will display an error message', fakeAsync(() => {
      let dummyError = 'error - alarm';
      activatedRouteStub.testParams = {
        error: dummyError
      };
      fixture.detectChanges();
      tick(1);

      expect(component.displayMessage).toContain(dummyError);
    }));
  });
});

export class MockActivatedRoute {
  private innerTestParams: any;
  private subject: BehaviorSubject<any> = new BehaviorSubject(this.testParams);

  params = this.subject.asObservable();
  queryParams = this.subject.asObservable();

  constructor(params?: Params) {
    if (params) {
      this.testParams = params;
    } else {
      this.testParams = {};
    }
  }

  get testParams() {
    return this.innerTestParams;
  }

  set testParams(params: {}) {
    this.innerTestParams = params;
    this.subject.next(params);
  }

  get snapshot() {
    return { params: this.testParams, queryParams: this.testParams };
  }
}
