import { TestBed } from '@angular/core/testing';

import { EpayServiceService } from './epay-service.service';

describe('EpayServiceService', () => {
  let service: EpayServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpayServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
