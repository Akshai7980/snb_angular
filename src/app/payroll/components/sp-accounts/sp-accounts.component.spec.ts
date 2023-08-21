import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpAccountsComponent } from './sp-accounts.component';

describe('SpAccountsComponent', () => {
  let component: SpAccountsComponent;
  let fixture: ComponentFixture<SpAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
