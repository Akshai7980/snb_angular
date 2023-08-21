import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsalPaymentDetailsLayoutComponent } from './esal-payment-details-layout.component';

describe('EsalPaymentDetailsLayoutComponent', () => {
  let component: EsalPaymentDetailsLayoutComponent;
  let fixture: ComponentFixture<EsalPaymentDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsalPaymentDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsalPaymentDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
