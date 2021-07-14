import {TestBed} from '@angular/core/testing';

import {ActivitiesRetrieverService} from './activities-retriever.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ActivitiesRetrieverService', () => {
  let service: ActivitiesRetrieverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(ActivitiesRetrieverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
