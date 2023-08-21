import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadPaymentsComponent } from './sadad-payments.component';

describe('SadadPaymentsComponent', () => {
  let component: SadadPaymentsComponent;
  let fixture: ComponentFixture<SadadPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
