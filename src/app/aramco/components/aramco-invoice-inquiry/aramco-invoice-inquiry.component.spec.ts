import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AramcoInvoiceInquiryComponent } from './aramco-invoice-inquiry.component';

describe('AramcoInvoiceInquiryComponent', () => {
  let component: AramcoInvoiceInquiryComponent;
  let fixture: ComponentFixture<AramcoInvoiceInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AramcoInvoiceInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AramcoInvoiceInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
