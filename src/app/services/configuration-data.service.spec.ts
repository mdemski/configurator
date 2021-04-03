import { TestBed } from '@angular/core/testing';

import { ConfigurationDataService } from './configuration-data.service';

describe('ConfigurationDataService', () => {
  let service: ConfigurationDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurationDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
