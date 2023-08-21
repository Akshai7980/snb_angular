import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpayDownloadCenterComponent } from './epay-download-center.component';

describe('EpayDownloadCenterComponent', () => {
  let component: EpayDownloadCenterComponent;
  let fixture: ComponentFixture<EpayDownloadCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpayDownloadCenterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpayDownloadCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
