import { TestBed } from '@angular/core/testing';

import { WindowDynamicValuesSetterService } from './window-dynamic-values-setter.service';

describe('WindowDynamicValuesSetterService', () => {
  let service: WindowDynamicValuesSetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowDynamicValuesSetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
