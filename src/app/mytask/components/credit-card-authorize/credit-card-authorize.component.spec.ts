import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardAuthorizeComponent } from './credit-card-authorize.component';

describe('CreditCardAuthorizeComponent', () => {
  let component: CreditCardAuthorizeComponent;
  let fixture: ComponentFixture<CreditCardAuthorizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardAuthorizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardAuthorizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
