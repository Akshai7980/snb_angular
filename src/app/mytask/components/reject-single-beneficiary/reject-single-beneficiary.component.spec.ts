import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectSingleBeneficiaryComponent } from './reject-single-beneficiary.component';

describe('RejectSingleBeneficiaryComponent', () => {
  let component: RejectSingleBeneficiaryComponent;
  let fixture: ComponentFixture<RejectSingleBeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectSingleBeneficiaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectSingleBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
