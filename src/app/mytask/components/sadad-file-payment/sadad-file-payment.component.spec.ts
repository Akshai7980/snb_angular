import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadFilePaymentComponent } from './sadad-file-payment.component';

describe('SadadFilePaymentComponent', () => {
  let component: SadadFilePaymentComponent;
  let fixture: ComponentFixture<SadadFilePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadFilePaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadFilePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
