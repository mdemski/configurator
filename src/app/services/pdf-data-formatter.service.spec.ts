import { TestBed } from '@angular/core/testing';

import { PdfDataFormatterService } from './pdf-data-formatter.service';

describe('PdfDataFormatterService', () => {
  let service: PdfDataFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfDataFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
