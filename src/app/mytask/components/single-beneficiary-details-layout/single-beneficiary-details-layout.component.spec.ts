import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleBeneficiaryDetailsLayoutComponent } from './single-beneficiary-details-layout.component';

describe('SingleBeneficiaryDetailsLayoutComponent', () => {
  let component: SingleBeneficiaryDetailsLayoutComponent;
  let fixture: ComponentFixture<SingleBeneficiaryDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleBeneficiaryDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleBeneficiaryDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
