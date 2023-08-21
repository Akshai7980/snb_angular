import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalPosMaintenanceComponent } from './terminal-pos-maintenance.component';

describe('TerminalPosMaintenanceComponent', () => {
  let component: TerminalPosMaintenanceComponent;
  let fixture: ComponentFixture<TerminalPosMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalPosMaintenanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalPosMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
