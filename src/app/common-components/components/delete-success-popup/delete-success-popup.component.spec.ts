import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSuccessPopupComponent } from './delete-success-popup.component';

describe('DeleteSuccessPopupComponent', () => {
  let component: DeleteSuccessPopupComponent;
  let fixture: ComponentFixture<DeleteSuccessPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSuccessPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSuccessPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
