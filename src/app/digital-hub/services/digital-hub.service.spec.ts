import { TestBed } from '@angular/core/testing';

import { DigitalHubService } from './digital-hub.service';

describe('DigitalHubService', () => {
  let service: DigitalHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigitalHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
