import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardShowPinComponent } from './credit-card-show-pin.component';

describe('CreditCardShowPinComponent', () => {
  let component: CreditCardShowPinComponent;
  let fixture: ComponentFixture<CreditCardShowPinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardShowPinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardShowPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
