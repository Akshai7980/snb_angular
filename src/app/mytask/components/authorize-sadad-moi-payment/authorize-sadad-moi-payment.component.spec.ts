import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeSadadMoiPaymentComponent } from './authorize-sadad-moi-payment.component';

describe('AuthorizeSadadMoiPaymentComponent', () => {
  let component: AuthorizeSadadMoiPaymentComponent;
  let fixture: ComponentFixture<AuthorizeSadadMoiPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeSadadMoiPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeSadadMoiPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
