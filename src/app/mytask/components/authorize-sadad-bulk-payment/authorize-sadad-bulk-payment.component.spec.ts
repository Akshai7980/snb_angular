import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeSadadBulkPaymentComponent } from './authorize-sadad-bulk-payment.component';

describe('AuthorizeSadadBulkPaymentComponent', () => {
  let component: AuthorizeSadadBulkPaymentComponent;
  let fixture: ComponentFixture<AuthorizeSadadBulkPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeSadadBulkPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeSadadBulkPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
