import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosPaperRollReviewComponent } from './pos-paper-roll-review.component';

describe('PosPaperRollReviewComponent', () => {
  let component: PosPaperRollReviewComponent;
  let fixture: ComponentFixture<PosPaperRollReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosPaperRollReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosPaperRollReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
