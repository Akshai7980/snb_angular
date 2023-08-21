import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardStatementsComponent } from './credit-card-statements.component';

describe('CreditCardStatementsComponent', () => {
  let component: CreditCardStatementsComponent;
  let fixture: ComponentFixture<CreditCardStatementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardStatementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
