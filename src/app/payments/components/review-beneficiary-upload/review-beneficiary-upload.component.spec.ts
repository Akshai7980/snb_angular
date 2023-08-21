import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewBeneficiaryUploadComponent } from './review-beneficiary-upload.component';

describe('ReviewBeneficiaryUploadComponent', () => {
  let component: ReviewBeneficiaryUploadComponent;
  let fixture: ComponentFixture<ReviewBeneficiaryUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewBeneficiaryUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewBeneficiaryUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
