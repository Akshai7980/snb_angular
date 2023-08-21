import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTasksBeneficiaryDetailsComponent } from './my-tasks-beneficiary-details.component';

describe('MyTasksBeneficiaryDetailsComponent', () => {
  let component: MyTasksBeneficiaryDetailsComponent;
  let fixture: ComponentFixture<MyTasksBeneficiaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTasksBeneficiaryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTasksBeneficiaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
