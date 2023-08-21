import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTasksSadadMoiRefundReqDetailsLayoutComponent } from './my-tasks-sadad-moi-refund-req-details-layout.component';

describe('MyTasksSadadMoiRefundReqDetailsLayoutComponent', () => {
  let component: MyTasksSadadMoiRefundReqDetailsLayoutComponent;
  let fixture: ComponentFixture<MyTasksSadadMoiRefundReqDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTasksSadadMoiRefundReqDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTasksSadadMoiRefundReqDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
