import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTasksEsalDetailsLayoutComponent } from './my-tasks-esal-details-layout.component';

describe('MyTasksEsalDetailsLayoutComponent', () => {
  let component: MyTasksEsalDetailsLayoutComponent;
  let fixture: ComponentFixture<MyTasksEsalDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTasksEsalDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTasksEsalDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
