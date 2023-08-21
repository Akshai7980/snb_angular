import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketInquiryComponent } from './ticket-inquiry.component';

describe('TicketInquiryComponent', () => {
  let component: TicketInquiryComponent;
  let fixture: ComponentFixture<TicketInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
