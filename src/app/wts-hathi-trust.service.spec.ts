import { TestBed } from '@angular/core/testing';

import { WtsHathiTrustService } from './wts-hathi-trust.service';

describe('WtsHathiTrustService', () => {
  let service: WtsHathiTrustService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WtsHathiTrustService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
