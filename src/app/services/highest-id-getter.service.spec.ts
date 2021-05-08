import { TestBed } from '@angular/core/testing';

import { HighestIdGetterService } from './highest-id-getter.service';

describe('HighestIdGetterService', () => {
  let service: HighestIdGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HighestIdGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
