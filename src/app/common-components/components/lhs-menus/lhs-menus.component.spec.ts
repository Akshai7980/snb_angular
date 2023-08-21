import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LhsMenusComponent } from './lhs-menus.component';

describe('LhsMenusComponent', () => {
  let component: LhsMenusComponent;
  let fixture: ComponentFixture<LhsMenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LhsMenusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LhsMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
