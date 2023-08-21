import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTransactionsMerchantDetailComponent } from './pos-transactions-merchant-detail.component';

describe('PosTransactionsMerchantDetailComponent', () => {
  let component: PosTransactionsMerchantDetailComponent;
  let fixture: ComponentFixture<PosTransactionsMerchantDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosTransactionsMerchantDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosTransactionsMerchantDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
