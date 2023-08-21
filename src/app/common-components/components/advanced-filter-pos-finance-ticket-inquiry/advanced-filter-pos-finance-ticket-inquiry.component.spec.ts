import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterPosFinanceTicketInquiryComponent } from './advanced-filter-pos-finance-ticket-inquiry.component';

describe('AdvancedFilterPosFinanceTicketInquiryComponent', () => {
  let component: AdvancedFilterPosFinanceTicketInquiryComponent;
  let fixture: ComponentFixture<AdvancedFilterPosFinanceTicketInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterPosFinanceTicketInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterPosFinanceTicketInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
