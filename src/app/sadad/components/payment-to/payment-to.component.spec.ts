import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentToComponent } from './payment-to.component';

describe('PaymentToComponent', () => {
  let component: PaymentToComponent;
  let fixture: ComponentFixture<PaymentToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentToComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
