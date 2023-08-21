import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditViewPinLayoutComponent } from './credit-view-pin-layout.component';

describe('CreditViewPinLayoutComponent', () => {
  let component: CreditViewPinLayoutComponent;
  let fixture: ComponentFixture<CreditViewPinLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditViewPinLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditViewPinLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
