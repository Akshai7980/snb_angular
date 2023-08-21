import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDetailsForCardComponent } from './account-details-for-card.component';

describe('AccountDetailsForCardComponent', () => {
  let component: AccountDetailsForCardComponent;
  let fixture: ComponentFixture<AccountDetailsForCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountDetailsForCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountDetailsForCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
