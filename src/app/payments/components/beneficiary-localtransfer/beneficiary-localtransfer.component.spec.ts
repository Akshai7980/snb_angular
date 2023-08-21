import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryLocaltransferComponent } from './beneficiary-localtransfer.component';

describe('BeneficiaryLocaltransferComponent', () => {
  let component: BeneficiaryLocaltransferComponent;
  let fixture: ComponentFixture<BeneficiaryLocaltransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryLocaltransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryLocaltransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
