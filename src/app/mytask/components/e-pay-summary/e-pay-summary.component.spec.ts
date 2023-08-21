import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPaySummaryComponent } from './e-pay-summary.component';

describe('EPaySummaryComponent', () => {
  let component: EPaySummaryComponent;
  let fixture: ComponentFixture<EPaySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPaySummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EPaySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
