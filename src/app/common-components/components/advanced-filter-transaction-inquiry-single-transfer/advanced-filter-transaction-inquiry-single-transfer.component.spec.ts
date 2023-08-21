import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterTransactionInquirySingleTransferComponent } from './advanced-filter-transaction-inquiry-single-transfer.component';

describe('AdvancedFilterTransactionInquirySingleTransferComponent', () => {
  let component: AdvancedFilterTransactionInquirySingleTransferComponent;
  let fixture: ComponentFixture<AdvancedFilterTransactionInquirySingleTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterTransactionInquirySingleTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterTransactionInquirySingleTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
