import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceInquiryRequestSummaryComponent } from './service-inquiry-request-summary.component';

describe('ServiceInquiryRequestSummaryComponent', () => {
  let component: ServiceInquiryRequestSummaryComponent;
  let fixture: ComponentFixture<ServiceInquiryRequestSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceInquiryRequestSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceInquiryRequestSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
