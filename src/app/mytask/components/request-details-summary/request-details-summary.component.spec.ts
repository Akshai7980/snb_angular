import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDetailsSummaryComponent } from './request-details-summary.component';

describe('RequestDetailsSummaryComponent', () => {
  let component: RequestDetailsSummaryComponent;
  let fixture: ComponentFixture<RequestDetailsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestDetailsSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestDetailsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
