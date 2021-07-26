import {TestBed} from '@angular/core/testing';

import {BackendService} from './backend.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('BackendService', () => {
  let service: BackendService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(BackendService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('test getToken', () => {
    it('should return an Observable<String>', () => {
      let dummyCode = '123';
      let dummyResponse = '321';
      service.getToken(dummyCode).subscribe(token => {
        expect(token).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne('http://localhost:8080/exchangeToken?code=' + dummyCode);
      expect(req.request.method).toBe('GET');
      req.flush(dummyResponse);
    });
  });

  describe('test getApiKey', () => {
    it('should return an Observable<String>', () => {
      let dummyResponse = '321';
      service.getApiKey().subscribe(token => {
        expect(token).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne('http://localhost:8080/googleApiToken');
      expect(req.request.method).toBe('GET');
      req.flush(dummyResponse);
    });
  });

  describe('test getActivities', () => {
    it('should return an Observable<any>[]', () => {
      let dummyToken = '123';
      let dummyResponse = [
        {id: '1', type: 'RIDE'},
        {id: '2', type: 'CANOEING'}
      ];
      service.getActivities(dummyToken).subscribe(activities => {
        expect(activities).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne('http://localhost:8080/activityList?token=' + dummyToken);
      expect(req.request.method).toBe('GET');
      req.flush(dummyResponse);
    });
  });

  describe('test mergeActivities', () => {
    it('should return an Observable<any>[]', () => {
      let dummyToken = '123';
      let mergeIds = [1, 2, 3];
      let dummyResponseNewId = '321';
      service.mergeActivities({}).subscribe(newId => {
        expect(newId).toEqual(dummyResponseNewId);
      });

      const req = httpMock.expectOne('http://localhost:8080/merge');
      expect(req.request.method).toBe('POST');
      req.flush(dummyResponseNewId);
    });
  });
});
