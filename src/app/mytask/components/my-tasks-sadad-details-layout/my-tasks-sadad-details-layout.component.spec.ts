import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTasksSadadDetailsLayoutComponent } from './my-tasks-sadad-details-layout.component';

describe('MyTasksSadadDetailsLayoutComponent', () => {
  let component: MyTasksSadadDetailsLayoutComponent;
  let fixture: ComponentFixture<MyTasksSadadDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTasksSadadDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTasksSadadDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
