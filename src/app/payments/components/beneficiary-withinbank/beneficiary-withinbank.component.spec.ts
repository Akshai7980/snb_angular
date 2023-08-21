import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryWithinbankComponent } from './beneficiary-withinbank.component';

describe('BeneficiaryWithinbankComponent', () => {
  let component: BeneficiaryWithinbankComponent;
  let fixture: ComponentFixture<BeneficiaryWithinbankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryWithinbankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryWithinbankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
