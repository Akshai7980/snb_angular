import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectSadadPaymentComponent } from './reject-sadad-payment.component';

describe('RejectSadadPaymentComponent', () => {
  let component: RejectSadadPaymentComponent;
  let fixture: ComponentFixture<RejectSadadPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectSadadPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectSadadPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
