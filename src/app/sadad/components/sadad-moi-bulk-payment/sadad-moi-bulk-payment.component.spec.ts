import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadMoiBulkPaymentComponent } from './sadad-moi-bulk-payment.component';

describe('SadadMoiBulkPaymentComponent', () => {
  let component: SadadMoiBulkPaymentComponent;
  let fixture: ComponentFixture<SadadMoiBulkPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadMoiBulkPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadMoiBulkPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
