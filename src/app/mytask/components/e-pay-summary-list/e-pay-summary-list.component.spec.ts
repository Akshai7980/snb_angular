import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPaySummaryListComponent } from './e-pay-summary-list.component';

describe('EPaySummaryListComponent', () => {
  let component: EPaySummaryListComponent;
  let fixture: ComponentFixture<EPaySummaryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPaySummaryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EPaySummaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
