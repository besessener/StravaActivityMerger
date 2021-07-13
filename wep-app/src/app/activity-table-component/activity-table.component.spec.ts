import { TestBed } from '@angular/core/testing';

import { ActivityTableComponent } from './activity-table.component';

describe('TokenService', () => {
  let component: ActivityTableComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    component = TestBed.inject(ActivityTableComponent);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
