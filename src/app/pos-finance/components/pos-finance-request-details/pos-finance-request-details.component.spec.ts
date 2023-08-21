import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosFinanceRequestDetailsComponent } from './pos-finance-request-details.component';

describe('PosFinanceRequestDetailsComponent', () => {
  let component: PosFinanceRequestDetailsComponent;
  let fixture: ComponentFixture<PosFinanceRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosFinanceRequestDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosFinanceRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
