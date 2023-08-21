import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosFinanceRequestReviewComponent } from './pos-finance-request-review.component';

describe('PosFinanceRequestReviewComponent', () => {
  let component: PosFinanceRequestReviewComponent;
  let fixture: ComponentFixture<PosFinanceRequestReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosFinanceRequestReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosFinanceRequestReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
