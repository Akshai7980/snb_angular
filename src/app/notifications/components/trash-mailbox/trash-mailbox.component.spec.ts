import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashMailboxComponent } from './trash-mailbox.component';

describe('TrashMailboxComponent', () => {
  let component: TrashMailboxComponent;
  let fixture: ComponentFixture<TrashMailboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrashMailboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrashMailboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
