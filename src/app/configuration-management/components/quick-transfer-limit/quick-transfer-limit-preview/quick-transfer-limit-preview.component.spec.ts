import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickTransferLimitPreviewComponent } from './quick-transfer-limit-preview.component';

describe('QuickTransferLimitPreviewComponent', () => {
  let component: QuickTransferLimitPreviewComponent;
  let fixture: ComponentFixture<QuickTransferLimitPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickTransferLimitPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickTransferLimitPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
