import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadcenterComponent } from './downloadcenter.component';

describe('DownloadcenterComponent', () => {
  let component: DownloadcenterComponent;
  let fixture: ComponentFixture<DownloadcenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadcenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadcenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
