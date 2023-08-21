import { TestBed } from '@angular/core/testing';

import { PosFinanceService } from './pos-finance.service';

describe('PosFinanceService', () => {
  let service: PosFinanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosFinanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
