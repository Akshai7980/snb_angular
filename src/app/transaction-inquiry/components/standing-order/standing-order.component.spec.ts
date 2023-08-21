import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandingOrderComponent } from './standing-order.component';

describe('StandingOrderComponent', () => {
  let component: StandingOrderComponent;
  let fixture: ComponentFixture<StandingOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandingOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandingOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
