import { TestBed } from '@angular/core/testing';

import { AramcoService } from './aramco.service';

describe('AramcoService', () => {
  let service: AramcoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AramcoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
