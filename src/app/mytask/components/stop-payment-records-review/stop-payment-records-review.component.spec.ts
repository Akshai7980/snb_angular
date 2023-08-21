import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopPaymentRecordsReviewComponent } from './stop-payment-records-review.component';

describe('StopPaymentRecordsReviewComponent', () => {
  let component: StopPaymentRecordsReviewComponent;
  let fixture: ComponentFixture<StopPaymentRecordsReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StopPaymentRecordsReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopPaymentRecordsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
