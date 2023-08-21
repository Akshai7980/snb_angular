import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosReviewTransactionDetailsComponent } from './pos-review-transaction-details.component';

describe('PosReviewTransactionDetailsComponent', () => {
  let component: PosReviewTransactionDetailsComponent;
  let fixture: ComponentFixture<PosReviewTransactionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosReviewTransactionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosReviewTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
