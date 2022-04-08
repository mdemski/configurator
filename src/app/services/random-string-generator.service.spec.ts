import { TestBed } from '@angular/core/testing';

import { RandomStringGeneratorService } from './random-string-generator.service';

describe('RandomStringGeneratorService', () => {
  let service: RandomStringGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomStringGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
