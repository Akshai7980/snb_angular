import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterStopPaymentSummaryComponent } from './advanced-filter-stop-payment-summary.component';

describe('AdvancedFilterStopPaymentSummaryComponent', () => {
  let component: AdvancedFilterStopPaymentSummaryComponent;
  let fixture: ComponentFixture<AdvancedFilterStopPaymentSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterStopPaymentSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterStopPaymentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
