import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterEPayTransactionComponent } from './advanced-filter-epay-transaction.component';

describe('AdvancedFilterEPayTransactionComponent', () => {
  let component: AdvancedFilterEPayTransactionComponent;
  let fixture: ComponentFixture<AdvancedFilterEPayTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterEPayTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterEPayTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
