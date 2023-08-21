import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationInquiryDetailsLayoutComponent } from './configuration-inquiry-details-layout.component';

describe('ConfigurationInquiryDetailsLayoutComponent', () => {
  let component: ConfigurationInquiryDetailsLayoutComponent;
  let fixture: ComponentFixture<ConfigurationInquiryDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationInquiryDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationInquiryDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
