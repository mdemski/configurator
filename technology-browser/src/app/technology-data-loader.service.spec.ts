import { TestBed } from '@angular/core/testing';

import { TechnologyDataLoaderService } from './technology-data-loader.service';

describe('TechnologyDataLoaderService', () => {
  let service: TechnologyDataLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechnologyDataLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
