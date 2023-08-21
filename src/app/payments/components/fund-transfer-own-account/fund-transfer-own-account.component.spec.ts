import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTransferOwnAccountComponent } from './fund-transfer-own-account.component';

describe('FundTransferOwnAccountComponent', () => {
  let component: FundTransferOwnAccountComponent;
  let fixture: ComponentFixture<FundTransferOwnAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundTransferOwnAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundTransferOwnAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
