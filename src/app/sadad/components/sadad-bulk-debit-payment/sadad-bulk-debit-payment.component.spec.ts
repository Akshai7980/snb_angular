import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadBulkDebitPaymentComponent } from './sadad-bulk-debit-payment.component';

describe('SadadBulkDebitPaymentComponent', () => {
  let component: SadadBulkDebitPaymentComponent;
  let fixture: ComponentFixture<SadadBulkDebitPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadBulkDebitPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadBulkDebitPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
