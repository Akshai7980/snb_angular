import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantFinanceDisputeComponent } from './merchant-finance-dispute.component';

describe('MerchantFinanceDisputeComponent', () => {
  let component: MerchantFinanceDisputeComponent;
  let fixture: ComponentFixture<MerchantFinanceDisputeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantFinanceDisputeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantFinanceDisputeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
