import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxyIdentifierDeregistrationComponent } from './proxy-identifier-deregistration.component';

describe('ProxyIdentifierDeregistrationComponent', () => {
  let component: ProxyIdentifierDeregistrationComponent;
  let fixture: ComponentFixture<ProxyIdentifierDeregistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProxyIdentifierDeregistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProxyIdentifierDeregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
