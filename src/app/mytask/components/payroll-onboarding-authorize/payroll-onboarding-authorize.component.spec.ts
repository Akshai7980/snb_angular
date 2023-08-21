import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollOnboardingAuthorizeComponent } from './payroll-onboarding-authorize.component';

describe('PayrollOnboardingAuthorizeComponent', () => {
  let component: PayrollOnboardingAuthorizeComponent;
  let fixture: ComponentFixture<PayrollOnboardingAuthorizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollOnboardingAuthorizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollOnboardingAuthorizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
