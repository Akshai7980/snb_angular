import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandingOrderDetailLayoutComponent } from './standing-order-detail-layout.component';

describe('StandingOrderDetailLayoutComponent', () => {
  let component: StandingOrderDetailLayoutComponent;
  let fixture: ComponentFixture<StandingOrderDetailLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandingOrderDetailLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandingOrderDetailLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
