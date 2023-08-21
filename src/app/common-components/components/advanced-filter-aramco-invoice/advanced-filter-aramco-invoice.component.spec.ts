import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterAramcoInvoiceComponent } from './advanced-filter-aramco-invoice.component';

describe('AdvancedFilterAramcoInvoiceComponent', () => {
  let component: AdvancedFilterAramcoInvoiceComponent;
  let fixture: ComponentFixture<AdvancedFilterAramcoInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterAramcoInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterAramcoInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
