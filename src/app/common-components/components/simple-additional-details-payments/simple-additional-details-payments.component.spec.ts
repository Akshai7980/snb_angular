import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleAdditionalDetailsPaymentsComponent } from './simple-additional-details-payments.component';

describe('SimpleAdditionalDetailsPaymentsComponent', () => {
  let component: SimpleAdditionalDetailsPaymentsComponent;
  let fixture: ComponentFixture<SimpleAdditionalDetailsPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleAdditionalDetailsPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleAdditionalDetailsPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
