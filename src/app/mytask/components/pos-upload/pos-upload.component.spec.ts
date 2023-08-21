import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosUploadComponent } from './pos-upload.component';

describe('PosUploadComponent', () => {
  let component: PosUploadComponent;
  let fixture: ComponentFixture<PosUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
