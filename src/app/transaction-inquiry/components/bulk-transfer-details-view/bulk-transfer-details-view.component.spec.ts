import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkTransferDetailsViewComponent } from './bulk-transfer-details-view.component';

describe('BulkTransferDetailsViewComponent', () => {
  let component: BulkTransferDetailsViewComponent;
  let fixture: ComponentFixture<BulkTransferDetailsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkTransferDetailsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkTransferDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
