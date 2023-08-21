import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersummaryTrackerDetailsComponent } from './transfersummary-tracker-details.component';

describe('TransfersummaryTrackerDetailsComponent', () => {
  let component: TransfersummaryTrackerDetailsComponent;
  let fixture: ComponentFixture<TransfersummaryTrackerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransfersummaryTrackerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransfersummaryTrackerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
