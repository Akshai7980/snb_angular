import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelTransactionReviewComponent } from './cancel-transaction-review.component';

describe('CancelTransactionReviewComponent', () => {
  let component: CancelTransactionReviewComponent;
  let fixture: ComponentFixture<CancelTransactionReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelTransactionReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelTransactionReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
