import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectSadadMoiPaymentComponent } from './reject-sadad-moi-payment.component';

describe('RejectSadadMoiPaymentComponent', () => {
  let component: RejectSadadMoiPaymentComponent;
  let fixture: ComponentFixture<RejectSadadMoiPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectSadadMoiPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectSadadMoiPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
