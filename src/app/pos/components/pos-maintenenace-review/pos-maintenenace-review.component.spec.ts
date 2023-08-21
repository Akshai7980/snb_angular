import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosMaintenenaceReviewComponent } from './pos-maintenenace-review.component';

describe('PosMaintenenaceReviewComponent', () => {
  let component: PosMaintenenaceReviewComponent;
  let fixture: ComponentFixture<PosMaintenenaceReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosMaintenenaceReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosMaintenenaceReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
