import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeStopPaymentComponent } from './authorize-stop-payment.component';

describe('AuthorizeStopPaymentComponent', () => {
  let component: AuthorizeStopPaymentComponent;
  let fixture: ComponentFixture<AuthorizeStopPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeStopPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeStopPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
