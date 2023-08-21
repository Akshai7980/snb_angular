import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadaMaterialReviewComponent } from './mada-material-review.component';

describe('MadaMaterialReviewComponent', () => {
  let component: MadaMaterialReviewComponent;
  let fixture: ComponentFixture<MadaMaterialReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadaMaterialReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MadaMaterialReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
