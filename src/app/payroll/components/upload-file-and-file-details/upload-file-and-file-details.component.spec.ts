import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileAndFileDetailsComponent } from './upload-file-and-file-details.component';

describe('UploadFileAndFileDetailsComponent', () => {
  let component: UploadFileAndFileDetailsComponent;
  let fixture: ComponentFixture<UploadFileAndFileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFileAndFileDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadFileAndFileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
