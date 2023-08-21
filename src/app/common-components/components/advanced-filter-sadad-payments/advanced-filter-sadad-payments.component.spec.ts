import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterSadadPaymentsComponent } from './advanced-filter-sadad-payments.component';

describe('AdvancedFilterSadadPaymentsComponent', () => {
  let component: AdvancedFilterSadadPaymentsComponent;
  let fixture: ComponentFixture<AdvancedFilterSadadPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterSadadPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterSadadPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
