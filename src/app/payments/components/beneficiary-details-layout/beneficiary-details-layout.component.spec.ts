import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryDetailsLayoutComponent } from './beneficiary-details-layout.component';

describe('BeneficiaryDetailsLayoutComponent', () => {
  let component: BeneficiaryDetailsLayoutComponent;
  let fixture: ComponentFixture<BeneficiaryDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
