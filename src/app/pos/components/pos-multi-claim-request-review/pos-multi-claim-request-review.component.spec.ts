import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosMultiClaimRequestReviewComponent } from './pos-multi-claim-request-review.component';

describe('PosMultiClaimRequestReviewComponent', () => {
  let component: PosMultiClaimRequestReviewComponent;
  let fixture: ComponentFixture<PosMultiClaimRequestReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosMultiClaimRequestReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosMultiClaimRequestReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
