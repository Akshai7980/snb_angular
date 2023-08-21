import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ETradeComponent } from './e-trade.component';

describe('ETradeComponent', () => {
  let component: ETradeComponent;
  let fixture: ComponentFixture<ETradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ETradeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ETradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
