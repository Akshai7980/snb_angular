import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryInternationaltransferComponent } from './beneficiary-internationaltransfer.component';

describe('BeneficiaryInternationaltransferComponent', () => {
  let component: BeneficiaryInternationaltransferComponent;
  let fixture: ComponentFixture<BeneficiaryInternationaltransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryInternationaltransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryInternationaltransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
