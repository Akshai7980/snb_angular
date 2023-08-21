import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterBeneficiaryComponent } from './advanced-filter-beneficiary.component';

describe('AdvancedFilterBeneficiaryComponent', () => {
  let component: AdvancedFilterBeneficiaryComponent;
  let fixture: ComponentFixture<AdvancedFilterBeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterBeneficiaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
