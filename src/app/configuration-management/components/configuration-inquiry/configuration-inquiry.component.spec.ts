import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationInquiryComponent } from './configuration-inquiry.component';

describe('ConfigurationInquiryComponent', () => {
  let component: ConfigurationInquiryComponent;
  let fixture: ComponentFixture<ConfigurationInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
