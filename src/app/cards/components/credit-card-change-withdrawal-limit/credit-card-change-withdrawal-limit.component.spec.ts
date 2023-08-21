import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardChangeWithdrawalLimitComponent } from './credit-card-change-withdrawal-limit.component';

describe('CreditCardChangeWithdrawalLimitComponent', () => {
  let component: CreditCardChangeWithdrawalLimitComponent;
  let fixture: ComponentFixture<CreditCardChangeWithdrawalLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardChangeWithdrawalLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardChangeWithdrawalLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
