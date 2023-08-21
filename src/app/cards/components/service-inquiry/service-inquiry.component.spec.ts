import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceInquiryComponent } from './service-inquiry.component';

describe('ServiceInquiryComponent', () => {
  let component: ServiceInquiryComponent;
  let fixture: ComponentFixture<ServiceInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
