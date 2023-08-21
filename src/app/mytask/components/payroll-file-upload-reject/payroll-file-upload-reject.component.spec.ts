import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollFileUploadRejectComponent } from './payroll-file-upload-reject.component';

describe('PayrollFileUploadRejectComponent', () => {
  let component: PayrollFileUploadRejectComponent;
  let fixture: ComponentFixture<PayrollFileUploadRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollFileUploadRejectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollFileUploadRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
