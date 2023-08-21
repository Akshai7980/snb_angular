import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollFileUploadDetailsComponent } from './payroll-file-upload-details.component';

describe('PayrollFileUploadDetailsComponent', () => {
  let component: PayrollFileUploadDetailsComponent;
  let fixture: ComponentFixture<PayrollFileUploadDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollFileUploadDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollFileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
