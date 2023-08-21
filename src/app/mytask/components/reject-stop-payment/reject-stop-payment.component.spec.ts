import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectStopPaymentComponent } from './reject-stop-payment.component';

describe('RejectStopPaymentComponent', () => {
  let component: RejectStopPaymentComponent;
  let fixture: ComponentFixture<RejectStopPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectStopPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectStopPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
