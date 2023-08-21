import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTransferInternationalComponent } from './fund-transfer-international.component';

describe('FundTransferInternationalComponent', () => {
  let component: FundTransferInternationalComponent;
  let fixture: ComponentFixture<FundTransferInternationalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundTransferInternationalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundTransferInternationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
