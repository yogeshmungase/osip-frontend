import { TestBed } from '@angular/core/testing';

import { OsipService } from './osip.service';

describe('OsipService', () => {
  let service: OsipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OsipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
