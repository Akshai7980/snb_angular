import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenInquiryComponent } from './token-inquiry.component';

describe('TokenInquiryComponent', () => {
  let component: TokenInquiryComponent;
  let fixture: ComponentFixture<TokenInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
