import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundRequestReviewComponent } from './refund-request-review.component';

describe('RefundRequestReviewComponent', () => {
  let component: RefundRequestReviewComponent;
  let fixture: ComponentFixture<RefundRequestReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundRequestReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefundRequestReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
