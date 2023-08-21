import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInquiryLayoutComponent } from './card-inquiry-layout.component';

describe('CardInquiryLayoutComponent', () => {
  let component: CardInquiryLayoutComponent;
  let fixture: ComponentFixture<CardInquiryLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardInquiryLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardInquiryLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
