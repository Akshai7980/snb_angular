import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickTransferLimitComponent } from './quick-transfer-limit.component';

describe('QuickTransferLimitComponent', () => {
  let component: QuickTransferLimitComponent;
  let fixture: ComponentFixture<QuickTransferLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickTransferLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickTransferLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
