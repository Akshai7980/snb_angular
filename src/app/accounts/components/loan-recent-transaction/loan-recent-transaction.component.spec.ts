import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRecentTransactionComponent } from './loan-recent-transaction.component';

describe('LoanRecentTransactionComponent', () => {
  let component: LoanRecentTransactionComponent;
  let fixture: ComponentFixture<LoanRecentTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanRecentTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanRecentTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
