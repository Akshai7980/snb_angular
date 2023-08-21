import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForStandReviewComponent } from './request-for-stand-review.component';

describe('RequestForStandReviewComponent', () => {
  let component: RequestForStandReviewComponent;
  let fixture: ComponentFixture<RequestForStandReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestForStandReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestForStandReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
