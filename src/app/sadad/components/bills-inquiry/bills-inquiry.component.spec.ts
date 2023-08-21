import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsInquiryComponent } from './bills-inquiry.component';

describe('BillsInquiryComponent', () => {
  let component: BillsInquiryComponent;
  let fixture: ComponentFixture<BillsInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillsInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillsInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
