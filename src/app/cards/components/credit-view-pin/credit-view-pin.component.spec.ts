import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditViewPinComponent } from './credit-view-pin.component';

describe('CreditViewPinComponent', () => {
  let component: CreditViewPinComponent;
  let fixture: ComponentFixture<CreditViewPinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditViewPinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditViewPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
