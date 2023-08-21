import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardFileTransfersComponent } from './onboard-file-transfers.component';

describe('OnboardFileTransfersComponent', () => {
  let component: OnboardFileTransfersComponent;
  let fixture: ComponentFixture<OnboardFileTransfersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardFileTransfersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardFileTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
