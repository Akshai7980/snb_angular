import { TestBed } from '@angular/core/testing';

import { ETradeService } from './e-trade.service';

describe('ETradeService', () => {
  let service: ETradeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ETradeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
