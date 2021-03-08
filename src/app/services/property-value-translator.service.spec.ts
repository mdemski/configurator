import { TestBed } from '@angular/core/testing';

import { PropertyValueTranslatorService } from './property-value-translator.service';

describe('PropertyValueTranslatorService', () => {
  let service: PropertyValueTranslatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyValueTranslatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
