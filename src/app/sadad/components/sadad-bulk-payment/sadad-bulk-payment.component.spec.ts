import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadBulkPaymentComponent } from './sadad-bulk-payment.component';

describe('SadadBulkPaymentComponent', () => {
  let component: SadadBulkPaymentComponent;
  let fixture: ComponentFixture<SadadBulkPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadBulkPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadBulkPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
