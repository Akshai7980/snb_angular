import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectEsalPaymentComponent } from './reject-esal-payment.component';

describe('RejectEsalPaymentComponent', () => {
  let component: RejectEsalPaymentComponent;
  let fixture: ComponentFixture<RejectEsalPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectEsalPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectEsalPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
