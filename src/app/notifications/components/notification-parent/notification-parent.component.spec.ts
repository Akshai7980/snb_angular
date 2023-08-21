import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationParentComponent } from './notification-parent.component';

describe('NotificationParentComponent', () => {
  let component: NotificationParentComponent;
  let fixture: ComponentFixture<NotificationParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationParentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
