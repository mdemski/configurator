import { TestBed } from '@angular/core/testing';

import { CrudFirebaseService } from './crud-firebase-service';

describe('ConfigurationDistributorService', () => {
  let service: CrudFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
