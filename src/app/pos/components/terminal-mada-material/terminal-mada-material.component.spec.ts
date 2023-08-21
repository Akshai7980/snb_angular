import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalMadaMaterialComponent } from './terminal-mada-material.component';

describe('TerminalMadaMaterialComponent', () => {
  let component: TerminalMadaMaterialComponent;
  let fixture: ComponentFixture<TerminalMadaMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalMadaMaterialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalMadaMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
