import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmtSingleTransferDetailsLayoutComponent } from './pmt-single-transfer-details-layout.component';

describe('PmtSingleTransferDetailsLayoutComponent', () => {
  let component: PmtSingleTransferDetailsLayoutComponent;
  let fixture: ComponentFixture<PmtSingleTransferDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmtSingleTransferDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmtSingleTransferDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
