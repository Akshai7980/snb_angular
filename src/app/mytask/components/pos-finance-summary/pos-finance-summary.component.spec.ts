import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosFinanceSummaryComponent } from './pos-finance-summary.component';

describe('PosFinanceSummaryComponent', () => {
  let component: PosFinanceSummaryComponent;
  let fixture: ComponentFixture<PosFinanceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosFinanceSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosFinanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
