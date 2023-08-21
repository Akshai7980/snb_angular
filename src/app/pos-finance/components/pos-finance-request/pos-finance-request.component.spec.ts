import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosFinanceRequestComponent } from './pos-finance-request.component';

describe('PosFinanceRequestComponent', () => {
  let component: PosFinanceRequestComponent;
  let fixture: ComponentFixture<PosFinanceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosFinanceRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosFinanceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
