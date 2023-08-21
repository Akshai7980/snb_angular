import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollFileSummaryDetailsComponent } from './payroll-file-summary-details.component';

describe('PayrollFileSummaryDetailsComponent', () => {
  let component: PayrollFileSummaryDetailsComponent;
  let fixture: ComponentFixture<PayrollFileSummaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollFileSummaryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollFileSummaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
