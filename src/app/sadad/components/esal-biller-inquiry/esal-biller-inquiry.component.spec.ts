import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsalBillerInquiryComponent } from './esal-biller-inquiry.component';

describe('EsalBillerInquiryComponent', () => {
  let component: EsalBillerInquiryComponent;
  let fixture: ComponentFixture<EsalBillerInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsalBillerInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsalBillerInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
