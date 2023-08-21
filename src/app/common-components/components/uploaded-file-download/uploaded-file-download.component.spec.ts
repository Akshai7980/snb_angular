import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedFileDownloadComponent } from './uploaded-file-download.component';

describe('UploadedFileDownloadComponent', () => {
  let component: UploadedFileDownloadComponent;
  let fixture: ComponentFixture<UploadedFileDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadedFileDownloadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadedFileDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
