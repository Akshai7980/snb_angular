import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosFinanceComponent } from './pos-finance.component';

describe('PosFinanceComponent', () => {
  let component: PosFinanceComponent;
  let fixture: ComponentFixture<PosFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosFinanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
