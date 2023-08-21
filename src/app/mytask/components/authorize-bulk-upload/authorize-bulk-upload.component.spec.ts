import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeBulkUploadComponent } from './authorize-bulk-upload.component';

describe('AuthorizeBulkUploadComponent', () => {
  let component: AuthorizeBulkUploadComponent;
  let fixture: ComponentFixture<AuthorizeBulkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeBulkUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
