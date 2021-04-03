import { TestBed } from '@angular/core/testing';

import { ConfigurationDistributorService } from './configuration-distributor.service';

describe('ConfigurationDistributorService', () => {
  let service: ConfigurationDistributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurationDistributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
