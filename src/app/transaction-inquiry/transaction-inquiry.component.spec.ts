import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionInquiryComponent } from './transaction-inquiry.component';

describe('TransactionInquiryComponent', () => {
  let component: TransactionInquiryComponent;
  let fixture: ComponentFixture<TransactionInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
