import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPayStatementsComponent } from './e-pay-statements.component';

describe('EPayStatementsComponent', () => {
  let component: EPayStatementsComponent;
  let fixture: ComponentFixture<EPayStatementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPayStatementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EPayStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
