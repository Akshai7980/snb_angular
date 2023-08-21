import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTransactionMainComponent } from './pos-transaction-main.component';

describe('PosTransactionMainComponent', () => {
  let component: PosTransactionMainComponent;
  let fixture: ComponentFixture<PosTransactionMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosTransactionMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosTransactionMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
