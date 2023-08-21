import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectCommonServicesComponent } from './reject-common-services.component';

describe('RejectCommonServicesComponent', () => {
  let component: RejectCommonServicesComponent;
  let fixture: ComponentFixture<RejectCommonServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectCommonServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectCommonServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
