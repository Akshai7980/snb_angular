import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTransactionsComponent } from './pos-transactions.component';

describe('PosTransactionsComponent', () => {
  let component: PosTransactionsComponent;
  let fixture: ComponentFixture<PosTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
