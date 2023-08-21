import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadSinglePaymentComponent } from './sadad-single-payment.component';

describe('SadadSinglePaymentComponent', () => {
  let component: SadadSinglePaymentComponent;
  let fixture: ComponentFixture<SadadSinglePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadSinglePaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadSinglePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
