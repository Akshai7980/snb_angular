import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleBeneficiaryDetailsComponent } from './single-beneficiary-details.component';

describe('SingleBeneficiaryDetailsComponent', () => {
  let component: SingleBeneficiaryDetailsComponent;
  let fixture: ComponentFixture<SingleBeneficiaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleBeneficiaryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleBeneficiaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
