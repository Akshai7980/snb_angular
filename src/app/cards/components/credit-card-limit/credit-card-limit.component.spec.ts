import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardLimitComponent } from './credit-card-limit.component';

describe('CreditCardLimitComponent', () => {
  let component: CreditCardLimitComponent;
  let fixture: ComponentFixture<CreditCardLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
