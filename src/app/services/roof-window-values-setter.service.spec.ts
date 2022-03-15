import {TestBed} from '@angular/core/testing';

import {RoofWindowValuesSetterService} from './roof-window-values-setter.service';

describe('WindowDynamicValuesSetterService', () => {
  let service: RoofWindowValuesSetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoofWindowValuesSetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
