import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDetailsSummaryComponent } from './additional-details-summary.component';

describe('AdditionalDetailsSummaryComponent', () => {
  let component: AdditionalDetailsSummaryComponent;
  let fixture: ComponentFixture<AdditionalDetailsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalDetailsSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalDetailsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
