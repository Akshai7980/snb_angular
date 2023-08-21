import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeSadadPaymentComponent } from './authorize-sadad-payment.component';

describe('AuthorizeSadadPaymentComponent', () => {
  let component: AuthorizeSadadPaymentComponent;
  let fixture: ComponentFixture<AuthorizeSadadPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeSadadPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeSadadPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
