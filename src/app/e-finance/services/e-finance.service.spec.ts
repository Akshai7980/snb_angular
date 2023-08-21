import { TestBed } from '@angular/core/testing';

import { EFinanceService } from './e-finance.service';

describe('EFinanceService', () => {
  let service: EFinanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EFinanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
