import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpUploadDetailsComponent } from './sp-upload-details.component';

describe('SpUploadDetailsComponent', () => {
  let component: SpUploadDetailsComponent;
  let fixture: ComponentFixture<SpUploadDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpUploadDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
