import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDebitInquiryComponent } from './fee-debit-inquiry.component';

describe('FeeDebitInquiryComponent', () => {
  let component: FeeDebitInquiryComponent;
  let fixture: ComponentFixture<FeeDebitInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeDebitInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeDebitInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
