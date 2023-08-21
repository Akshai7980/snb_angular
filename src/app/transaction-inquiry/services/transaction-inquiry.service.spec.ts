import { TestBed } from '@angular/core/testing';

import { TransactionInquiryService } from './transaction-inquiry.service';

describe('TransactionInquiryService', () => {
  let service: TransactionInquiryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionInquiryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
