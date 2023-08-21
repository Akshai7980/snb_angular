import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AramcoMakePaymentComponent } from './aramco-make-payment.component';

describe('AramcoMakePaymentComponent', () => {
  let component: AramcoMakePaymentComponent;
  let fixture: ComponentFixture<AramcoMakePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AramcoMakePaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AramcoMakePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
