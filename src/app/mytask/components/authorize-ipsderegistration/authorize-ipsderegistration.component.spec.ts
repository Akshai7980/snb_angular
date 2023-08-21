import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeIPSDeregistrationComponent } from './authorize-ipsderegistration.component';

describe('AuthorizeIPSDeregistrationComponent', () => {
  let component: AuthorizeIPSDeregistrationComponent;
  let fixture: ComponentFixture<AuthorizeIPSDeregistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeIPSDeregistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeIPSDeregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
