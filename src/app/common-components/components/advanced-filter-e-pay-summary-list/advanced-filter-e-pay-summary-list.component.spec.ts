import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterEPaySummaryLisComponent } from './advanced-filter-e-pay-summary-list.component';

describe('AdvancedFilterEPaySummaryLisComponent', () => {
  let component: AdvancedFilterEPaySummaryLisComponent;
  let fixture: ComponentFixture<AdvancedFilterEPaySummaryLisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterEPaySummaryLisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterEPaySummaryLisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
