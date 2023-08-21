import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeSadadBillerComponent } from './authorize-sadad-biller.component';

describe('AuthorizeSadadBillerComponent', () => {
  let component: AuthorizeSadadBillerComponent;
  let fixture: ComponentFixture<AuthorizeSadadBillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeSadadBillerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeSadadBillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
