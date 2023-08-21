import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpPaymentReviewComponent } from './sp-payment-review.component';

describe('SpPaymentReviewComponent', () => {
  let component: SpPaymentReviewComponent;
  let fixture: ComponentFixture<SpPaymentReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpPaymentReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpPaymentReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
