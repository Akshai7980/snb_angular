import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterMytaskPosFinanceListComponent } from './advanced-filter-mytask-pos-finance-list.component';

describe('AdvancedFilterMytaskPosFinanceListComponent', () => {
  let component: AdvancedFilterMytaskPosFinanceListComponent;
  let fixture: ComponentFixture<AdvancedFilterMytaskPosFinanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterMytaskPosFinanceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterMytaskPosFinanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
