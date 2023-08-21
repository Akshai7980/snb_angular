import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadBillerInquiryComponent } from './sadad-biller-inquiry.component';

describe('SadadBillerInquiryComponent', () => {
  let component: SadadBillerInquiryComponent;
  let fixture: ComponentFixture<SadadBillerInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadBillerInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadBillerInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
