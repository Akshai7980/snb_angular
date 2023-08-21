import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadMoiPaymentToComponent } from './sadad-moi-payment-to.component';

describe('PaymentToComponent', () => {
  let component: SadadMoiPaymentToComponent;
  let fixture: ComponentFixture<SadadMoiPaymentToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadMoiPaymentToComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadMoiPaymentToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
