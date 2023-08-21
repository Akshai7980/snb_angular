import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpInquirySummaryComponent } from './sp-inquiry-summary.component';

describe('SpInquirySummaryComponent', () => {
  let component: SpInquirySummaryComponent;
  let fixture: ComponentFixture<SpInquirySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpInquirySummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpInquirySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
