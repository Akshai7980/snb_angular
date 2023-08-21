import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatInvoiceComponent } from './vat-invoice.component';

describe('VatInvoiceComponent', () => {
  let component: VatInvoiceComponent;
  let fixture: ComponentFixture<VatInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VatInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VatInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
