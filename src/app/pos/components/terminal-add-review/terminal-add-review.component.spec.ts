import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalAddReviewComponent } from './terminal-add-review.component';

describe('TerminalAddReviewComponent', () => {
  let component: TerminalAddReviewComponent;
  let fixture: ComponentFixture<TerminalAddReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalAddReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalAddReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
