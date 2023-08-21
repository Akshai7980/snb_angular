import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAccountsComponent } from './external-accounts.component';

describe('ExternalAccountsComponent', () => {
  let component: ExternalAccountsComponent;
  let fixture: ComponentFixture<ExternalAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
