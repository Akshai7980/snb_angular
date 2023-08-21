import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardPaymentLayoutComponent } from './credit-card-payment-layout.component';

describe('CreditCardPaymentLayoutComponent', () => {
  let component: CreditCardPaymentLayoutComponent;
  let fixture: ComponentFixture<CreditCardPaymentLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardPaymentLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardPaymentLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
