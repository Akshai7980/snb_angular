import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopCreditCardComponent } from './stop-credit-card.component';

describe('StopCreditCardComponent', () => {
  let component: StopCreditCardComponent;
  let fixture: ComponentFixture<StopCreditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StopCreditCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopCreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
