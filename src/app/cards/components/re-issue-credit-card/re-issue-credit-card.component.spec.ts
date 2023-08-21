import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReIssueCreditCardComponent } from './re-issue-credit-card.component';

describe('ReIssueCreditCardComponent', () => {
  let component: ReIssueCreditCardComponent;
  let fixture: ComponentFixture<ReIssueCreditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReIssueCreditCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReIssueCreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
