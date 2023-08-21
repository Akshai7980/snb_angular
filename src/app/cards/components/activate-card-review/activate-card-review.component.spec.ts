import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateCardReviewComponent } from './activate-card-review.component';

describe('ActivateCardReviewComponent', () => {
  let component: ActivateCardReviewComponent;
  let fixture: ComponentFixture<ActivateCardReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivateCardReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivateCardReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
