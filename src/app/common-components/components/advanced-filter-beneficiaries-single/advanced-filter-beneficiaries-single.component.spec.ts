import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterBeneficiariesSingleComponent } from './advanced-filter-beneficiaries-single.component';

describe('AdvancedFilterBeneficiariesSingleComponent', () => {
  let component: AdvancedFilterBeneficiariesSingleComponent;
  let fixture: ComponentFixture<AdvancedFilterBeneficiariesSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterBeneficiariesSingleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterBeneficiariesSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
