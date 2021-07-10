import { TestBed } from '@angular/core/testing';

import { LoadConfigurationService } from './load-configuration.service';

describe('LoadWindowConfigurationService', () => {
  let service: LoadConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
