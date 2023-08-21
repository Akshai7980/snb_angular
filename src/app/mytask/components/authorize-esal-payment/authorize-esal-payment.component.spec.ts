import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeEsalPaymentComponent } from './authorize-esal-payment.component';

describe('AuthorizeEsalPaymentComponent', () => {
  let component: AuthorizeEsalPaymentComponent;
  let fixture: ComponentFixture<AuthorizeEsalPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeEsalPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeEsalPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
