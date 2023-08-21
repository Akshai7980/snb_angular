import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalManagementReviewComponent } from './terminal-management-review.component';

describe('TerminalManagementReviewComponent', () => {
  let component: TerminalManagementReviewComponent;
  let fixture: ComponentFixture<TerminalManagementReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalManagementReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalManagementReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
