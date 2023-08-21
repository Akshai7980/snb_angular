import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsalPaymentDetailsComponent } from './esal-payment-details.component';

describe('EsalPaymentDetailsComponent', () => {
  let component: EsalPaymentDetailsComponent;
  let fixture: ComponentFixture<EsalPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsalPaymentDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsalPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
