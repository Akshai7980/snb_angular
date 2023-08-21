import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopPaymentDetailsComponent } from './stop-payment-details.component';

describe('StopPaymentDetailsComponent', () => {
  let component: StopPaymentDetailsComponent;
  let fixture: ComponentFixture<StopPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StopPaymentDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
