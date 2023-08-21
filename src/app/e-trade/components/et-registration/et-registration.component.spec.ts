import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtRegistrationComponent } from './et-registration.component';

describe('EtRegistrationComponent', () => {
  let component: EtRegistrationComponent;
  let fixture: ComponentFixture<EtRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
