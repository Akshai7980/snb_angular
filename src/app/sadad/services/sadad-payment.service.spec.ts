import { TestBed } from '@angular/core/testing';

import { SadadPaymentService } from './sadad-payment.service';

describe('SadadPaymentService', () => {
  let service: SadadPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SadadPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
