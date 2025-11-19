import { TestBed } from '@angular/core/testing';

import { UnitStats } from './unit-stats';

describe('UnitStats', () => {
  let service: UnitStats;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitStats);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
