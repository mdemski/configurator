import { TestBed } from '@angular/core/testing';

import { AccessoryValuesSetterService } from './accessory-values-setter.service';

describe('AccessoryValuesSetterService', () => {
  let service: AccessoryValuesSetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessoryValuesSetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
