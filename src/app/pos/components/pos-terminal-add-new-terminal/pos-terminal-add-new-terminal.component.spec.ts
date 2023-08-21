import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTerminalAddNewTerminalComponent } from './pos-terminal-add-new-terminal.component';

describe('PosTerminalAddNewTerminalComponent', () => {
  let component: PosTerminalAddNewTerminalComponent;
  let fixture: ComponentFixture<PosTerminalAddNewTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosTerminalAddNewTerminalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosTerminalAddNewTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
