import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosPurchaseLimitMadaCardComponent } from './pos-purchase-limit-mada-card.component';

describe('PosPurchaseLimitMadaCardComponent', () => {
  let component: PosPurchaseLimitMadaCardComponent;
  let fixture: ComponentFixture<PosPurchaseLimitMadaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosPurchaseLimitMadaCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosPurchaseLimitMadaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
