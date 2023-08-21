import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableRecordSummaryComponent } from './editable-record-summary.component';

describe('EditableRecordSummaryComponent', () => {
  let component: EditableRecordSummaryComponent;
  let fixture: ComponentFixture<EditableRecordSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditableRecordSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditableRecordSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
