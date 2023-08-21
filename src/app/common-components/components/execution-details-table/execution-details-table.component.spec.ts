import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionDetailsTableComponent } from './execution-details-table.component';

describe('ExecutionDetailsTableComponent', () => {
  let component: ExecutionDetailsTableComponent;
  let fixture: ComponentFixture<ExecutionDetailsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutionDetailsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutionDetailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
