import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDetailsPaymentsComponent } from './additional-details-payments.component';

describe('AdditionalDetailsPaymentsComponent', () => {
  let component: AdditionalDetailsPaymentsComponent;
  let fixture: ComponentFixture<AdditionalDetailsPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalDetailsPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalDetailsPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
