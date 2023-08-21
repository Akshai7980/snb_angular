import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeregistrationProxyIdentifierComponent } from './deregistration-proxy-identifier.component';

describe('DeregistrationProxyIdentifierComponent', () => {
  let component: DeregistrationProxyIdentifierComponent;
  let fixture: ComponentFixture<DeregistrationProxyIdentifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeregistrationProxyIdentifierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeregistrationProxyIdentifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
