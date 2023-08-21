import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxyIdentifierRegistrationComponent } from './proxy-identifier-registration.component';

describe('ProxyIdentifierRegistrationComponent', () => {
  let component: ProxyIdentifierRegistrationComponent;
  let fixture: ComponentFixture<ProxyIdentifierRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProxyIdentifierRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProxyIdentifierRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
