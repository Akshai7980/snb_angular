import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollOnboardingDetailsComponent } from './payroll-onboarding-details.component';

describe('PayrollOnboardingDetailsComponent', () => {
  let component: PayrollOnboardingDetailsComponent;
  let fixture: ComponentFixture<PayrollOnboardingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollOnboardingDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollOnboardingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
