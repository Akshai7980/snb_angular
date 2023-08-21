import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardRejectComponent } from './credit-card-reject.component';

describe('CreditCardRejectComponent', () => {
  let component: CreditCardRejectComponent;
  let fixture: ComponentFixture<CreditCardRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardRejectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
