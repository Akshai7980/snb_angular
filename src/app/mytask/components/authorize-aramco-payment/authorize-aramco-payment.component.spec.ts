import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeAramcoPaymentComponent } from './authorize-aramco-payment.component';

describe('AuthorizeAramcoPaymentComponent', () => {
  let component: AuthorizeAramcoPaymentComponent;
  let fixture: ComponentFixture<AuthorizeAramcoPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeAramcoPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeAramcoPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
