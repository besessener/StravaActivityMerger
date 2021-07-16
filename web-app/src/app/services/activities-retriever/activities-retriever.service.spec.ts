import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ActivitiesRetrieverService} from './activities-retriever.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BackendService} from "../backend/backend.service";
import {of} from "rxjs";

describe('ActivitiesRetrieverService', () => {
  let service: ActivitiesRetrieverService;
  let backendService: BackendService;

  let dummyToken = '123';
  let dummyCode = 'code';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        BackendService
      ]
    });
    service = TestBed.inject(ActivitiesRetrieverService);
    backendService = TestBed.inject(BackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('test token gets updated onSet', () => {
    it('should update observable token', fakeAsync(() => {

      let dummyResponse = {token: dummyToken};
      spyOn(backendService, "getToken").withArgs(dummyCode).and.returnValue(of(dummyResponse));

      expect(service.token.getValue()).toEqual('');

      service.setTokenFromCode(dummyCode);

      tick(1);

      expect(service.token.getValue()).toEqual(dummyToken);
    }));
  });

  describe('test activities get updated onSet', () => {
    it('should update observable activities', fakeAsync(() => {

      let dummyResponse = ['one', 'two'];
      spyOn(backendService, "getActivities").withArgs(dummyToken).and.returnValue(of(dummyResponse));

      expect(service.activities.getValue()).toEqual([]);

      service.setActivitiesWithToken(dummyToken);

      tick(1);

      expect(service.activities.getValue()).toEqual(dummyResponse);
    }));
  });
});
