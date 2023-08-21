import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsInquiryComponent } from './cards-inquiry.component';

describe('CardsInquiryComponent', () => {
  let component: CardsInquiryComponent;
  let fixture: ComponentFixture<CardsInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardsInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
