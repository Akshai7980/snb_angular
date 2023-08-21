import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreActionComponent } from './more-action.component';

describe('MoreActionComponent', () => {
  let component: MoreActionComponent;
  let fixture: ComponentFixture<MoreActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoreActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
