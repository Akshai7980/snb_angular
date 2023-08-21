import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosFinanceTicketInquirySummaryComponent } from './pos-finance-ticket-inquiry-summary.component';

describe('PosFinanceTicketInquirySummaryComponent', () => {
  let component: PosFinanceTicketInquirySummaryComponent;
  let fixture: ComponentFixture<PosFinanceTicketInquirySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosFinanceTicketInquirySummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosFinanceTicketInquirySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
