import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterEPayServiceInquiryComponent } from './advanced-filter-e-pay-service-inquiry.component';

describe('AdvancedFilterEPayServiceInquiryComponent', () => {
  let component: AdvancedFilterEPayServiceInquiryComponent;
  let fixture: ComponentFixture<AdvancedFilterEPayServiceInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterEPayServiceInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterEPayServiceInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
