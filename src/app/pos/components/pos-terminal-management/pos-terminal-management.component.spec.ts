import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTerminalManagementComponent } from './pos-terminal-management.component';

describe('PosTerminalManagementComponent', () => {
  let component: PosTerminalManagementComponent;
  let fixture: ComponentFixture<PosTerminalManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosTerminalManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosTerminalManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
