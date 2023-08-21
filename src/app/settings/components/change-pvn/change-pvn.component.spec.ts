import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePvnComponent } from './change-pvn.component';

describe('ChangePvnComponent', () => {
  let component: ChangePvnComponent;
  let fixture: ComponentFixture<ChangePvnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePvnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePvnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
