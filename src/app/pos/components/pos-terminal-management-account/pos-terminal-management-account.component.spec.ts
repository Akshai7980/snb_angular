import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTerminalManagementAccountComponent } from './pos-terminal-management-account.component';

describe('PosTerminalManagementAccountComponent', () => {
  let component: PosTerminalManagementAccountComponent;
  let fixture: ComponentFixture<PosTerminalManagementAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosTerminalManagementAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosTerminalManagementAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
