import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterLoansComponent } from './advanced-filter-loans.component';

describe('AdvancedFilterLoansComponent', () => {
  let component: AdvancedFilterLoansComponent;
  let fixture: ComponentFixture<AdvancedFilterLoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterLoansComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
