import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersummaryDetailsComponent } from './transfersummary-details.component';

describe('TransfersummaryDetailsComponent', () => {
  let component: TransfersummaryDetailsComponent;
  let fixture: ComponentFixture<TransfersummaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransfersummaryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransfersummaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
