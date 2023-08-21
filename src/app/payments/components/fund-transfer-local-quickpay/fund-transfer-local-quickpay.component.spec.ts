import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTransferLocalQuickpayComponent } from './fund-transfer-local-quickpay.component';

describe('FundTransferLocalQuickpayComponent', () => {
  let component: FundTransferLocalQuickpayComponent;
  let fixture: ComponentFixture<FundTransferLocalQuickpayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundTransferLocalQuickpayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundTransferLocalQuickpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
