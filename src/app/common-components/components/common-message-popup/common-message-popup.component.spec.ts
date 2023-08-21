import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonMessagePopupComponent } from './common-message-popup.component';

describe('CommonMessagePopupComponent', () => {
  let component: CommonMessagePopupComponent;
  let fixture: ComponentFixture<CommonMessagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonMessagePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonMessagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
