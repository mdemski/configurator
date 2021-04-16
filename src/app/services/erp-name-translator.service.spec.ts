import { TestBed } from '@angular/core/testing';

import { ErpNameTranslatorService } from './erp-name-translator.service';

describe('ErpNameTranslatorService', () => {
  let service: ErpNameTranslatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErpNameTranslatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
