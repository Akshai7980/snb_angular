import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTransferLocalComponent } from './fund-transfer-local.component';

describe('FundTransferLocalComponent', () => {
  let component: FundTransferLocalComponent;
  let fixture: ComponentFixture<FundTransferLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundTransferLocalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundTransferLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
