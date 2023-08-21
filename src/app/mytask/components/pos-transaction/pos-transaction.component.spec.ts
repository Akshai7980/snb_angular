import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTransactionComponent } from './pos-transaction.component';

describe('PosTransactionComponent', () => {
  let component: PosTransactionComponent;
  let fixture: ComponentFixture<PosTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
