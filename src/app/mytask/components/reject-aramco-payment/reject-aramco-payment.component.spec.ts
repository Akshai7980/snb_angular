import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectAramcoPaymentComponent } from './reject-aramco-payment.component';

describe('RejectAramcoPaymentComponent', () => {
  let component: RejectAramcoPaymentComponent;
  let fixture: ComponentFixture<RejectAramcoPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectAramcoPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectAramcoPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
