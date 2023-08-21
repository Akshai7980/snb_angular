import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollOnboardingComponent } from './payroll-onboarding.component';

describe('PayrollOnboardingComponent', () => {
  let component: PayrollOnboardingComponent;
  let fixture: ComponentFixture<PayrollOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollOnboardingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
