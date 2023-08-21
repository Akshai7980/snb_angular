import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTransactionsAccountDetailComponent } from './pos-transactions-account-detail.component';

describe('PosTransactionsAccountDetailComponent', () => {
  let component: PosTransactionsAccountDetailComponent;
  let fixture: ComponentFixture<PosTransactionsAccountDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosTransactionsAccountDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosTransactionsAccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
