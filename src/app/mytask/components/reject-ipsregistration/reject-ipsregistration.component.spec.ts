import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectIPSRegistrationComponent } from './reject-ipsregistration.component';

describe('RejectIPSRegistrationComponent', () => {
  let component: RejectIPSRegistrationComponent;
  let fixture: ComponentFixture<RejectIPSRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectIPSRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectIPSRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
