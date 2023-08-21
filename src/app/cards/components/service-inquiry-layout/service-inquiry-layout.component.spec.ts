import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceInquiryLayoutComponent } from './service-inquiry-layout.component';

describe('ServiceInquiryLayoutComponent', () => {
  let component: ServiceInquiryLayoutComponent;
  let fixture: ComponentFixture<ServiceInquiryLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceInquiryLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceInquiryLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
