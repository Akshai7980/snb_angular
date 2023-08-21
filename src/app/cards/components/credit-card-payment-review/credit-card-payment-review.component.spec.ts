import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardPaymentReviewComponent } from './credit-card-payment-review.component';

describe('CreditCardPaymentReviewComponent', () => {
  let component: CreditCardPaymentReviewComponent;
  let fixture: ComponentFixture<CreditCardPaymentReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardPaymentReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardPaymentReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
