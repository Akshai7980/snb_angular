import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosFinanceTicketInquiryComponent } from './pos-finance-ticket-inquiry.component';

describe('PosFinanceTicketInquiryComponent', () => {
  let component: PosFinanceTicketInquiryComponent;
  let fixture: ComponentFixture<PosFinanceTicketInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosFinanceTicketInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosFinanceTicketInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
