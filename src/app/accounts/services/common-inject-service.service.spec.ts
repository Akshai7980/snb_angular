import { TestBed } from '@angular/core/testing';

import { CommonInjectServiceService } from './common-inject-service.service';

describe('CommonInjectServiceService', () => {
  let service: CommonInjectServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonInjectServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
