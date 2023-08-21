import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePassConfirmPopupComponent } from './change-pass-confirm-popup.component';

describe('ChangePassConfirmPopupComponent', () => {
  let component: ChangePassConfirmPopupComponent;
  let fixture: ComponentFixture<ChangePassConfirmPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePassConfirmPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePassConfirmPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
