import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectPosTransactionDetailsComponent } from './reject-pos-transaction-details.component';

describe('RejectPosTransactionDetailsComponent', () => {
  let component: RejectPosTransactionDetailsComponent;
  let fixture: ComponentFixture<RejectPosTransactionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectPosTransactionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectPosTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
