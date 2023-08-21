import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPayTransactionsComponent } from './e-pay-transactions.component';

describe('EPayTransactionsComponent', () => {
  let component: EPayTransactionsComponent;
  let fixture: ComponentFixture<EPayTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPayTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EPayTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
