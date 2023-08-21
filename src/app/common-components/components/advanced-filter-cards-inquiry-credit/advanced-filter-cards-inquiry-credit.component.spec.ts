import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterCardsInquiryCreditComponent } from './advanced-filter-cards-inquiry-credit.component';

describe('AdvancedFilterCardsInquiryCreditComponent', () => {
  let component: AdvancedFilterCardsInquiryCreditComponent;
  let fixture: ComponentFixture<AdvancedFilterCardsInquiryCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterCardsInquiryCreditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterCardsInquiryCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
