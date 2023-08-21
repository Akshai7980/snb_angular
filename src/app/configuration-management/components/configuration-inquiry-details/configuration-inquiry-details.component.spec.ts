import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationInquiryDetailsComponent } from './configuration-inquiry-details.component';

describe('ConfigurationInquiryDetailsComponent', () => {
  let component: ConfigurationInquiryDetailsComponent;
  let fixture: ComponentFixture<ConfigurationInquiryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationInquiryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationInquiryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
