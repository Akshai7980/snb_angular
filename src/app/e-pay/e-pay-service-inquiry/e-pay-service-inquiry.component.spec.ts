import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPayServiceInquiryComponent } from './e-pay-service-inquiry.component';

describe('EPayServiceInquiryComponent', () => {
  let component: EPayServiceInquiryComponent;
  let fixture: ComponentFixture<EPayServiceInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPayServiceInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EPayServiceInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
