import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPayDebitComponent } from './e-pay-debit.component';

describe('EPayDebitComponent', () => {
  let component: EPayDebitComponent;
  let fixture: ComponentFixture<EPayDebitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPayDebitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EPayDebitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
