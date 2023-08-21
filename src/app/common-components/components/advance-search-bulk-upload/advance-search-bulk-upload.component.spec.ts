import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSearchBulkUploadComponent } from './advance-search-bulk-upload.component';

describe('AdvanceSearchBulkUploadComponent', () => {
  let component: AdvanceSearchBulkUploadComponent;
  let fixture: ComponentFixture<AdvanceSearchBulkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceSearchBulkUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceSearchBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
