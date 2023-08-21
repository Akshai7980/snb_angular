import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTransferLocalAdhocComponent } from './fund-transfer-local-adhoc.component';

describe('FundTransferLocalAdhocComponent', () => {
  let component: FundTransferLocalAdhocComponent;
  let fixture: ComponentFixture<FundTransferLocalAdhocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundTransferLocalAdhocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundTransferLocalAdhocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
