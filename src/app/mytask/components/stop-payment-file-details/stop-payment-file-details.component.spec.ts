import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopPaymentFileDetailsComponent } from './stop-payment-file-details.component';

describe('StopPaymentFileDetailsComponent', () => {
  let component: StopPaymentFileDetailsComponent;
  let fixture: ComponentFixture<StopPaymentFileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StopPaymentFileDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopPaymentFileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
