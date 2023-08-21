import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBulkBeneficiaryComponent } from './upload-bulk-beneficiary.component';

describe('UploadBulkBeneficiaryComponent', () => {
  let component: UploadBulkBeneficiaryComponent;
  let fixture: ComponentFixture<UploadBulkBeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadBulkBeneficiaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadBulkBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
