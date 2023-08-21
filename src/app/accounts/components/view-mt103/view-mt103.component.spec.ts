import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMT103Component } from './view-mt103.component';

describe('ViewMT103Component', () => {
  let component: ViewMT103Component;
  let fixture: ComponentFixture<ViewMT103Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMT103Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMT103Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
