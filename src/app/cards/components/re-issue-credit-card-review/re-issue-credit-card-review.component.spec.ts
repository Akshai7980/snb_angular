import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReIssueCreditCardReviewComponent } from './re-issue-credit-card-review.component';

describe('ReIssueCreditCardReviewComponent', () => {
  let component: ReIssueCreditCardReviewComponent;
  let fixture: ComponentFixture<ReIssueCreditCardReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReIssueCreditCardReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReIssueCreditCardReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
