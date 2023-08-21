import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickTransferConfigComponent } from './quick-transfer-config.component';

describe('QuickTransferConfigComponent', () => {
  let component: QuickTransferConfigComponent;
  let fixture: ComponentFixture<QuickTransferConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickTransferConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickTransferConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
