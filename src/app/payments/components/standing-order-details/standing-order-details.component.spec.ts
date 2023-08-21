import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandingOrderDetailsComponent } from './standing-order-details.component';

describe('StandingOrderDetailsComponent', () => {
  let component: StandingOrderDetailsComponent;
  let fixture: ComponentFixture<StandingOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandingOrderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandingOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
