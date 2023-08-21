import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryInquiryComponent } from './beneficiary-inquiry.component';

describe('BeneficiaryInquiryComponent', () => {
  let component: BeneficiaryInquiryComponent;
  let fixture: ComponentFixture<BeneficiaryInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
