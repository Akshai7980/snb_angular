import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceInquiryAdditionalAccountComponent } from './service-inquiry-additional-account.component';

describe('ServiceInquiryAdditionalAccountComponent', () => {
  let component: ServiceInquiryAdditionalAccountComponent;
  let fixture: ComponentFixture<ServiceInquiryAdditionalAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceInquiryAdditionalAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceInquiryAdditionalAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
