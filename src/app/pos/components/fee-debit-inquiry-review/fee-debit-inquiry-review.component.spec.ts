import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDebitInquiryReviewComponent } from './fee-debit-inquiry-review.component';

describe('FeeDebitInquiryReviewComponent', () => {
  let component: FeeDebitInquiryReviewComponent;
  let fixture: ComponentFixture<FeeDebitInquiryReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeDebitInquiryReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeDebitInquiryReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
