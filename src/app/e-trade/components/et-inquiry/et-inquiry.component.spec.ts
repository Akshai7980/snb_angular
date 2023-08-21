import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtInquiryComponent } from './et-inquiry.component';

describe('EtInquiryComponent', () => {
  let component: EtInquiryComponent;
  let fixture: ComponentFixture<EtInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
