import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersummaryPaymentsDetailsComponent } from './transfersummary-payments-details.component';

describe('TransfersummaryPaymentsDetailsComponent', () => {
  let component: TransfersummaryPaymentsDetailsComponent;
  let fixture: ComponentFixture<TransfersummaryPaymentsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransfersummaryPaymentsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransfersummaryPaymentsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
