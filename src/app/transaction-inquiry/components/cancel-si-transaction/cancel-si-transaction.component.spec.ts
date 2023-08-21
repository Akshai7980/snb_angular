import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelSiTransactionComponent } from './cancel-si-transaction.component';

describe('CancelSiTransactionComponent', () => {
  let component: CancelSiTransactionComponent;
  let fixture: ComponentFixture<CancelSiTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelSiTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelSiTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
