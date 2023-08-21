import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiClaimMerchantDetailsComponent } from './multi-claim-merchant-details.component';

describe('MultiClaimMerchantDetailsComponent', () => {
  let component: MultiClaimMerchantDetailsComponent;
  let fixture: ComponentFixture<MultiClaimMerchantDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiClaimMerchantDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiClaimMerchantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
