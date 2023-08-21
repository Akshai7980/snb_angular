import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTasksAramcoDetailsLayoutComponent } from './my-tasks-aramco-details-layout.component';

describe('MyTasksAramcoDetailsLayoutComponent', () => {
  let component: MyTasksAramcoDetailsLayoutComponent;
  let fixture: ComponentFixture<MyTasksAramcoDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTasksAramcoDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTasksAramcoDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
