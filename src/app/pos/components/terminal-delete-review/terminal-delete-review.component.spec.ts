import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalDeleteReviewComponent } from './terminal-delete-review.component';

describe('TerminalDeleteReviewComponent', () => {
  let component: TerminalDeleteReviewComponent;
  let fixture: ComponentFixture<TerminalDeleteReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalDeleteReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalDeleteReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
