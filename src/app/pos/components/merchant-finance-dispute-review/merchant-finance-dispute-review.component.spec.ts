import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantFinanceDisputeReviewComponent } from './merchant-finance-dispute-review.component';

describe('MerchantFinanceDisputeReviewComponent', () => {
  let component: MerchantFinanceDisputeReviewComponent;
  let fixture: ComponentFixture<MerchantFinanceDisputeReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantFinanceDisputeReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantFinanceDisputeReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
