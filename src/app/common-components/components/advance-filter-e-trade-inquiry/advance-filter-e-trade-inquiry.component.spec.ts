import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceFilterETradeInquiryComponent } from './advance-filter-e-trade-inquiry.component';

describe('AdvanceFilterETradeInquiryComponent', () => {
  let component: AdvanceFilterETradeInquiryComponent;
  let fixture: ComponentFixture<AdvanceFilterETradeInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceFilterETradeInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceFilterETradeInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
