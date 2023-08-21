import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxyIdentifierComponent } from './proxy-identifier.component';

describe('ProxyIdentifierComponent', () => {
  let component: ProxyIdentifierComponent;
  let fixture: ComponentFixture<ProxyIdentifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProxyIdentifierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProxyIdentifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
