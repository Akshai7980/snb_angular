import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptBeneficiaryUploadComponent } from './receipt-beneficiary-upload.component';

describe('ReceiptBeneficiaryUploadComponent', () => {
  let component: ReceiptBeneficiaryUploadComponent;
  let fixture: ComponentFixture<ReceiptBeneficiaryUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptBeneficiaryUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptBeneficiaryUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
