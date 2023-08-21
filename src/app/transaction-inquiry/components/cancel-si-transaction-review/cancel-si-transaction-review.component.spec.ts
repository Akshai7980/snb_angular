import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelSiTransactionReviewComponent } from './cancel-si-transaction-review.component';

describe('CancelSiTransactionReviewComponent', () => {
  let component: CancelSiTransactionReviewComponent;
  let fixture: ComponentFixture<CancelSiTransactionReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelSiTransactionReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelSiTransactionReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
