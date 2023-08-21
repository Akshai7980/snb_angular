import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcorpGeneralIssueTicketInquiryComponent } from './ecorp-general-issue-ticket-inquiry.component';

describe('EcorpGeneralIssueTicketInquiryComponent', () => {
  let component: EcorpGeneralIssueTicketInquiryComponent;
  let fixture: ComponentFixture<EcorpGeneralIssueTicketInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcorpGeneralIssueTicketInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcorpGeneralIssueTicketInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
