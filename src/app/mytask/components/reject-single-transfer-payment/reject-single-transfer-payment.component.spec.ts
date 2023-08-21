import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectSingleTransferPaymentComponent } from './reject-single-transfer-payment.component';

describe('RejectSingleTransferPaymentComponent', () => {
  let component: RejectSingleTransferPaymentComponent;
  let fixture: ComponentFixture<RejectSingleTransferPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectSingleTransferPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectSingleTransferPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
