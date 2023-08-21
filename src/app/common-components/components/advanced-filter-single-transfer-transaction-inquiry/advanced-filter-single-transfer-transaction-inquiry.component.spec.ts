import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterSingleTransferTransactionInquiryComponent } from './advanced-filter-single-transfer-transaction-inquiry.component';

describe('AdvancedFilterSingleTransferTransactionInquiryComponent', () => {
  let component: AdvancedFilterSingleTransferTransactionInquiryComponent;
  let fixture: ComponentFixture<AdvancedFilterSingleTransferTransactionInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterSingleTransferTransactionInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterSingleTransferTransactionInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
