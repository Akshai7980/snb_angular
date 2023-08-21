import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadMoiRefundPaymentToComponent } from './sadad-moi-refund-payment-to.component';

describe('SadadMoiRefundPaymentToComponent', () => {
  let component: SadadMoiRefundPaymentToComponent;
  let fixture: ComponentFixture<SadadMoiRefundPaymentToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadMoiRefundPaymentToComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadMoiRefundPaymentToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
