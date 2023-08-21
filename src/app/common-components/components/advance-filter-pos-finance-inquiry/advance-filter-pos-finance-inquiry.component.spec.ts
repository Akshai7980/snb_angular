import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceFilterPosFinanceInquiryComponent } from './advance-filter-pos-finance-inquiry.component';

describe('AdvanceFilterPosFinanceInquiryComponent', () => {
  let component: AdvanceFilterPosFinanceInquiryComponent;
  let fixture: ComponentFixture<AdvanceFilterPosFinanceInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceFilterPosFinanceInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceFilterPosFinanceInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
