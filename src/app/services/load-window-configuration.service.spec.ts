import { TestBed } from '@angular/core/testing';

import { LoadWindowConfigurationService } from './load-window-configuration.service';

describe('LoadWindowConfigurationService', () => {
  let service: LoadWindowConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadWindowConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
