import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTransferWithinBankComponent } from './fund-transfer-within-bank.component';

describe('FundTransferWithinBankComponent', () => {
  let component: FundTransferWithinBankComponent;
  let fixture: ComponentFixture<FundTransferWithinBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundTransferWithinBankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundTransferWithinBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
