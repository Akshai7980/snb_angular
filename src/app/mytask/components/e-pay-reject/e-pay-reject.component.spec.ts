import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPayRejectComponent } from './e-pay-reject.component';

describe('EPayRejectComponent', () => {
  let component: EPayRejectComponent;
  let fixture: ComponentFixture<EPayRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPayRejectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EPayRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
