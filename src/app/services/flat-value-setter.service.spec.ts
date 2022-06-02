import { TestBed } from '@angular/core/testing';

import { FlatValueSetterService } from './flat-value-setter.service';

describe('FlatValueSetterService', () => {
  let service: FlatValueSetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlatValueSetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
