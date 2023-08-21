import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTasksSadadMoiDetailsLayoutComponent } from './my-tasks-sadad-moi-details-layout.component';

describe('MyTasksSadadMoiDetailsLayoutComponent', () => {
  let component: MyTasksSadadMoiDetailsLayoutComponent;
  let fixture: ComponentFixture<MyTasksSadadMoiDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTasksSadadMoiDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTasksSadadMoiDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
