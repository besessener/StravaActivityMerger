import { TestBed } from '@angular/core/testing';

import { ActivitiesRetrieverService } from './activities-retriever.service';

describe('ActivitiesRetrieverService', () => {
  let service: ActivitiesRetrieverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivitiesRetrieverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
