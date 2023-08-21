import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalAccountReviewComponent } from './additional-account-review.component';

describe('AdditionalAccountReviewComponent', () => {
  let component: AdditionalAccountReviewComponent;
  let fixture: ComponentFixture<AdditionalAccountReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalAccountReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalAccountReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
