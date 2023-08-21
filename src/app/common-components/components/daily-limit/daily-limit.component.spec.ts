import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyLimitComponent } from './daily-limit.component';

describe('DailyLimitComponent', () => {
  let component: DailyLimitComponent;
  let fixture: ComponentFixture<DailyLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
