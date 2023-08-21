import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryActivationComponent } from './beneficiary-activation.component';

describe('BeneficiaryActivationComponent', () => {
  let component: BeneficiaryActivationComponent;
  let fixture: ComponentFixture<BeneficiaryActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryActivationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
