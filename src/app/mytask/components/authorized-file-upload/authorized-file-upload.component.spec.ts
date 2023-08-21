import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedFileUploadComponent } from './authorized-file-upload.component';

describe('AuthorizedFileUploadComponent', () => {
  let component: AuthorizedFileUploadComponent;
  let fixture: ComponentFixture<AuthorizedFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizedFileUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizedFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
