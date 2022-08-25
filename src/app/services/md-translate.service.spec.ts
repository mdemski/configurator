import { TestBed } from '@angular/core/testing';

import { MdTranslateService } from './md-translate.service';

describe('MdTranslateService', () => {
  let service: MdTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MdTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
