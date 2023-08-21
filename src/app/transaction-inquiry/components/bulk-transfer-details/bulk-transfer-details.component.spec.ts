import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkTransferDetailsComponent } from './bulk-transfer-details.component';

describe('BulkTransferDetailsComponent', () => {
  let component: BulkTransferDetailsComponent;
  let fixture: ComponentFixture<BulkTransferDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkTransferDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkTransferDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
