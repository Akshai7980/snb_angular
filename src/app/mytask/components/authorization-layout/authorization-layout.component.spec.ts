import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationLayoutComponent } from './authorization-layout.component';

describe('AuthorizationLayoutComponent', () => {
  let component: AuthorizationLayoutComponent;
  let fixture: ComponentFixture<AuthorizationLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizationLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizationLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
