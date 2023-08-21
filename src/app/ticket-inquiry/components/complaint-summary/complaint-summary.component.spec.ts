import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintSummaryComponent } from './complaint-summary.component';

describe('ComplaintSummaryComponent', () => {
  let component: ComplaintSummaryComponent;
  let fixture: ComponentFixture<ComplaintSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
