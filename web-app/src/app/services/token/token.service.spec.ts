import {TestBed} from '@angular/core/testing';

import {TokenService} from './token.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
