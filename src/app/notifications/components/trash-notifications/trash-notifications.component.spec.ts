import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashNotificationsComponent } from './trash-notifications.component';

describe('TrashNotificationsComponent', () => {
  let component: TrashNotificationsComponent;
  let fixture: ComponentFixture<TrashNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrashNotificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrashNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
