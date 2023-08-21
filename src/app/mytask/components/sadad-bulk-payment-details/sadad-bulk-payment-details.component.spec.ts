import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadBulkPaymentDetailsComponent } from './sadad-bulk-payment-details.component';

describe('SadadBulkPaymentDetailsComponent', () => {
  let component: SadadBulkPaymentDetailsComponent;
  let fixture: ComponentFixture<SadadBulkPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadBulkPaymentDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadBulkPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
