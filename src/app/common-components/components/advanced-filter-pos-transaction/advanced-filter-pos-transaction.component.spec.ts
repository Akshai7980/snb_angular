import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterPosTransactionComponent } from './advanced-filter-pos-transaction.component';

describe('AdvancedFilterPosTransactionComponent', () => {
  let component: AdvancedFilterPosTransactionComponent;
  let fixture: ComponentFixture<AdvancedFilterPosTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterPosTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterPosTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
