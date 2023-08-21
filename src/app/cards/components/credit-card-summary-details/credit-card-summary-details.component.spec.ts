import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardSummaryDetailsComponent } from './credit-card-summary-details.component';

describe('CreditCardSummaryDetailsComponent', () => {
  let component: CreditCardSummaryDetailsComponent;
  let fixture: ComponentFixture<CreditCardSummaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardSummaryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardSummaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
