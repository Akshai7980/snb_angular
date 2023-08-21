import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadEsalPaymentToComponent } from './sadad-esal-payment-to.component';

describe('SadadEsalPaymentToComponent', () => {
  let component: SadadEsalPaymentToComponent;
  let fixture: ComponentFixture<SadadEsalPaymentToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadEsalPaymentToComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadEsalPaymentToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
