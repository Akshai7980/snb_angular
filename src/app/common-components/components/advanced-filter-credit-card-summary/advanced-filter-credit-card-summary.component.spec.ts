import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterCreditCardSummaryComponent } from './advanced-filter-credit-card-summary.component';

describe('AdvancedFilterCreditCardSummaryComponent', () => {
  let component: AdvancedFilterCreditCardSummaryComponent;
  let fixture: ComponentFixture<AdvancedFilterCreditCardSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterCreditCardSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterCreditCardSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
