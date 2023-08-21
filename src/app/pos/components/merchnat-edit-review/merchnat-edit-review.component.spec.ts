import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchnatEditReviewComponent } from './merchnat-edit-review.component';

describe('MerchnatEditReviewComponent', () => {
  let component: MerchnatEditReviewComponent;
  let fixture: ComponentFixture<MerchnatEditReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchnatEditReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchnatEditReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
