import { TestBed } from '@angular/core/testing';

import { WindowModelBuilderService } from './window-model-builder.service';

describe('WindowModelBuilderService', () => {
  let service: WindowModelBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowModelBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
