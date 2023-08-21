import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterTransctnInquirySadadComponent } from './advanced-filter-transctn-inquiry-sadad.component';

describe('AdvancedFilterTransctnInquirySadadComponent', () => {
  let component: AdvancedFilterTransctnInquirySadadComponent;
  let fixture: ComponentFixture<AdvancedFilterTransctnInquirySadadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterTransctnInquirySadadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterTransctnInquirySadadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
