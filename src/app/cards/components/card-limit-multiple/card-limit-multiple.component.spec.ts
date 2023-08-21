import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLimitMultipleComponent } from './card-limit-multiple.component';

describe('CardLimitMultipleComponent', () => {
  let component: CardLimitMultipleComponent;
  let fixture: ComponentFixture<CardLimitMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardLimitMultipleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardLimitMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
