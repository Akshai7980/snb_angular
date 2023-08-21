import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeIPSRegistrationComponent } from './authorize-ipsregistration.component';

describe('AuthorizeIPSRegistrationComponent', () => {
  let component: AuthorizeIPSRegistrationComponent;
  let fixture: ComponentFixture<AuthorizeIPSRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeIPSRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeIPSRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
