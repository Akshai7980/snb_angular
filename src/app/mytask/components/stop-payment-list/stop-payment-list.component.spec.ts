import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopPaymentListComponent } from './stop-payment-list.component';

describe('StopPaymentListComponent', () => {
  let component: StopPaymentListComponent;
  let fixture: ComponentFixture<StopPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StopPaymentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
