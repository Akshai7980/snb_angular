import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosStatementAccountComponent } from './pos-statement-account.component';

describe('PosStatementAccountComponent', () => {
  let component: PosStatementAccountComponent;
  let fixture: ComponentFixture<PosStatementAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosStatementAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosStatementAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
