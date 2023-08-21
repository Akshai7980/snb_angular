import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaisecomplaintspayrollComponent } from './raisecomplaintspayroll.component';

describe('RaisecomplaintspayrollComponent', () => {
  let component: RaisecomplaintspayrollComponent;
  let fixture: ComponentFixture<RaisecomplaintspayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaisecomplaintspayrollComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaisecomplaintspayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
