import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosFinanceRejectComponent } from './pos-finance-reject.component';

describe('PosFinanceRejectComponent', () => {
  let component: PosFinanceRejectComponent;
  let fixture: ComponentFixture<PosFinanceRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosFinanceRejectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosFinanceRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
