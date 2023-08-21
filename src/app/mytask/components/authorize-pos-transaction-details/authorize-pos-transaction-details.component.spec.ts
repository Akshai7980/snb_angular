import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizePosTransactionDetailsComponent } from './authorize-pos-transaction-details.component';

describe('AuthorizePosTransactionDetailsComponent', () => {
  let component: AuthorizePosTransactionDetailsComponent;
  let fixture: ComponentFixture<AuthorizePosTransactionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizePosTransactionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizePosTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
