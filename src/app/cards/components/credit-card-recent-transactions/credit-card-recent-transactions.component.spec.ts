import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardRecentTransactionsComponent } from './credit-card-recent-transactions.component';

describe('CreditCardRecentTransactionsComponent', () => {
  let component: CreditCardRecentTransactionsComponent;
  let fixture: ComponentFixture<CreditCardRecentTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardRecentTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardRecentTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
