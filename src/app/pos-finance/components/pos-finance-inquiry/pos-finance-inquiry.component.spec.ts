import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosFinanceInquiryComponent } from './pos-finance-inquiry.component';

describe('PosFinanceInquiryComponent', () => {
  let component: PosFinanceInquiryComponent;
  let fixture: ComponentFixture<PosFinanceInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosFinanceInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosFinanceInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
