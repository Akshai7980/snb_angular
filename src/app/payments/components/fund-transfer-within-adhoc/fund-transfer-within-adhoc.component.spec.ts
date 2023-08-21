import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTransferWithinAdhocComponent } from './fund-transfer-within-adhoc.component';

describe('FundTransferWithinAdhocComponent', () => {
  let component: FundTransferWithinAdhocComponent;
  let fixture: ComponentFixture<FundTransferWithinAdhocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundTransferWithinAdhocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundTransferWithinAdhocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
