import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintsSummaryLayoutComponent } from './complaints-summary-layout.component';

describe('ComplaintsSummaryLayoutComponent', () => {
  let component: ComplaintsSummaryLayoutComponent;
  let fixture: ComponentFixture<ComplaintsSummaryLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintsSummaryLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintsSummaryLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
