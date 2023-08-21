import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTasksEsalBillerDetailsLayoutComponent } from './my-tasks-esal-biller-details-layout.component';

describe('MyTasksEsalBillerDetailsLayoutComponent', () => {
  let component: MyTasksEsalBillerDetailsLayoutComponent;
  let fixture: ComponentFixture<MyTasksEsalBillerDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTasksEsalBillerDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTasksEsalBillerDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
