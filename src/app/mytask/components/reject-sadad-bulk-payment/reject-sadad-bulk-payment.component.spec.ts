import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectSadadBulkPaymentComponent } from './reject-sadad-bulk-payment.component';

describe('RejectSadadBulkPaymentComponent', () => {
  let component: RejectSadadBulkPaymentComponent;
  let fixture: ComponentFixture<RejectSadadBulkPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectSadadBulkPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectSadadBulkPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
