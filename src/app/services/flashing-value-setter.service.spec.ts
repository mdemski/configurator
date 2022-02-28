import {TestBed} from '@angular/core/testing';

import {FlashingValueSetterService} from './flashing-value-setter.service';

describe('FlashingValueSetterService', () => {
  let service: FlashingValueSetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlashingValueSetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
