import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosStatementComponent } from './pos-statement.component';

describe('PosStatementComponent', () => {
  let component: PosStatementComponent;
  let fixture: ComponentFixture<PosStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosStatementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
