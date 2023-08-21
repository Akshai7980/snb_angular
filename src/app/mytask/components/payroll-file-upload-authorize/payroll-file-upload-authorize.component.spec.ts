import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollFileUploadAuthorizeComponent } from './payroll-file-upload-authorize.component';

describe('PayrollFileUploadAuthorizeComponent', () => {
  let component: PayrollFileUploadAuthorizeComponent;
  let fixture: ComponentFixture<PayrollFileUploadAuthorizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollFileUploadAuthorizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollFileUploadAuthorizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
