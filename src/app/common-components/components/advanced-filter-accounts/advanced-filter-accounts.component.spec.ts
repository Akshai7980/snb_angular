import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterAccountsComponent } from './advanced-filter-accounts.component';

describe('AdvancedFilterAccountsComponent', () => {
  let component: AdvancedFilterAccountsComponent;
  let fixture: ComponentFixture<AdvancedFilterAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
