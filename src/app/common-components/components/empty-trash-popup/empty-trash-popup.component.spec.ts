import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyTrashPopupComponent } from './empty-trash-popup.component';

describe('EmptyTrashPopupComponent', () => {
  let component: EmptyTrashPopupComponent;
  let fixture: ComponentFixture<EmptyTrashPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyTrashPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyTrashPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
