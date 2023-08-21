import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditViewPinReviewComponent } from './credit-view-pin-review.component';

describe('CreditViewPinReviewComponent', () => {
  let component: CreditViewPinReviewComponent;
  let fixture: ComponentFixture<CreditViewPinReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditViewPinReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditViewPinReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
