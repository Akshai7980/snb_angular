import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollOnboardingRejectComponent } from './payroll-onboarding-reject.component';

describe('PayrollOnboardingRejectComponent', () => {
  let component: PayrollOnboardingRejectComponent;
  let fixture: ComponentFixture<PayrollOnboardingRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollOnboardingRejectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollOnboardingRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
