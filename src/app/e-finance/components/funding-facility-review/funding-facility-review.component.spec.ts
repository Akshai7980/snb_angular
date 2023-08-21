import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingFacilityReviewComponent } from './funding-facility-review.component';

describe('FundingFacilityReviewComponent', () => {
  let component: FundingFacilityReviewComponent;
  let fixture: ComponentFixture<FundingFacilityReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundingFacilityReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundingFacilityReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
