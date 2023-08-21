import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsInquiryComponent } from './accounts-inquiry.component';

describe('AccountsInquiryComponent', () => {
  let component: AccountsInquiryComponent;
  let fixture: ComponentFixture<AccountsInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
