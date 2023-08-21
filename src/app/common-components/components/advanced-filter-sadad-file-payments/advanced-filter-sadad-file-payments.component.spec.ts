import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterSadadFilePaymentsComponent } from './advanced-filter-sadad-file-payments.component';

describe('AdvancedFilterSadadFilePaymentsComponent', () => {
  let component: AdvancedFilterSadadFilePaymentsComponent;
  let fixture: ComponentFixture<AdvancedFilterSadadFilePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterSadadFilePaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterSadadFilePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
