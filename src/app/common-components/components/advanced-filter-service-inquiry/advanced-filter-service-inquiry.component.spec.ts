import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterServiceInquiryComponent } from './advanced-filter-service-inquiry.component';

describe('AdvancedFilterServiceInquiryComponent', () => {
  let component: AdvancedFilterServiceInquiryComponent;
  let fixture: ComponentFixture<AdvancedFilterServiceInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterServiceInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterServiceInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
