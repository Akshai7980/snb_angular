import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectBulkUploadComponent } from './reject-bulk-upload.component';

describe('RejectBulkUploadComponent', () => {
  let component: RejectBulkUploadComponent;
  let fixture: ComponentFixture<RejectBulkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectBulkUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
