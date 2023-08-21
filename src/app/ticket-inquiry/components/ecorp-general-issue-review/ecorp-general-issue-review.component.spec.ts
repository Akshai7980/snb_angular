import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcorpGeneralIssueReviewComponent } from './ecorp-general-issue-review.component';

describe('EcorpGeneralIssueReviewComponent', () => {
  let component: EcorpGeneralIssueReviewComponent;
  let fixture: ComponentFixture<EcorpGeneralIssueReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcorpGeneralIssueReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcorpGeneralIssueReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
