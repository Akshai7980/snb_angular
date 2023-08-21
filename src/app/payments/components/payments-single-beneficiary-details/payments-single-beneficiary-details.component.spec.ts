import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsSingleBeneficiaryDetailsComponent } from './payments-single-beneficiary-details.component';

describe('PaymentsSingleBeneficiaryDetailsComponent', () => {
  let component: PaymentsSingleBeneficiaryDetailsComponent;
  let fixture: ComponentFixture<PaymentsSingleBeneficiaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsSingleBeneficiaryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsSingleBeneficiaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
