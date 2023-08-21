import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReIssueCreditCardLayoutComponent } from './re-issue-credit-card-layout.component';

describe('ReIssueCreditCardLayoutComponent', () => {
  let component: ReIssueCreditCardLayoutComponent;
  let fixture: ComponentFixture<ReIssueCreditCardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReIssueCreditCardLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReIssueCreditCardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
