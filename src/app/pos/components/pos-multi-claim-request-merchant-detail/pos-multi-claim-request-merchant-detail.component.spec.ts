import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosMultiClaimRequestMerchantDetailComponent } from './pos-multi-claim-request-merchant-detail.component';

describe('PosMultiClaimRequestMerchantDetailComponent', () => {
  let component: PosMultiClaimRequestMerchantDetailComponent;
  let fixture: ComponentFixture<PosMultiClaimRequestMerchantDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosMultiClaimRequestMerchantDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosMultiClaimRequestMerchantDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
