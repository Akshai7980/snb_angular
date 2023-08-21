import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalManagementAddNewMerchantComponent } from './terminal-management-add-new-merchant.component';

describe('TerminalManagementAddNewMerchantComponent', () => {
  let component: TerminalManagementAddNewMerchantComponent;
  let fixture: ComponentFixture<TerminalManagementAddNewMerchantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalManagementAddNewMerchantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalManagementAddNewMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
