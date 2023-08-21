import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AramcoToPaymentComponent } from './aramco-to-payment.component';

describe('AramcoToPaymentComponent', () => {
  let component: AramcoToPaymentComponent;
  let fixture: ComponentFixture<AramcoToPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AramcoToPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AramcoToPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
