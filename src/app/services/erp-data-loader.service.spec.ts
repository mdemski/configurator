import { TestBed } from '@angular/core/testing';

import { ErpDataLoaderService } from './erp-data-loader.service';

describe('ErpDataLoaderService', () => {
  let service: ErpDataLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErpDataLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
