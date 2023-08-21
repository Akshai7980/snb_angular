import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingFacilityInquiryComponent } from './funding-facility-inquiry.component';

describe('FundingFacilityInquiryComponent', () => {
  let component: FundingFacilityInquiryComponent;
  let fixture: ComponentFixture<FundingFacilityInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundingFacilityInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundingFacilityInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
