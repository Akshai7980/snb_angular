import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeSingleBeneficiaryComponent } from './authorize-single-beneficiary.component';

describe('AuthorizeSingleBeneficiaryComponent', () => {
  let component: AuthorizeSingleBeneficiaryComponent;
  let fixture: ComponentFixture<AuthorizeSingleBeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeSingleBeneficiaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeSingleBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
