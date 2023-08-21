import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceFilterTicketInquiryComponent } from './advance-filter-ticket-inquiry.component';

describe('AdvanceFilterTicketInquiryComponent', () => {
  let component: AdvanceFilterTicketInquiryComponent;
  let fixture: ComponentFixture<AdvanceFilterTicketInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceFilterTicketInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceFilterTicketInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
