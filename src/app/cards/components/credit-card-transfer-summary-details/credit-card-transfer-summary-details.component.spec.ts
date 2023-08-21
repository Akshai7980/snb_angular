import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardTransferSummaryDetailsComponent } from './credit-card-transfer-summary-details.component';

describe('CreditCardTransferSummaryDetailsComponent', () => {
  let component: CreditCardTransferSummaryDetailsComponent;
  let fixture: ComponentFixture<CreditCardTransferSummaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardTransferSummaryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardTransferSummaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
