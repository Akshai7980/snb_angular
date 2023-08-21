import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalPosPapperRollComponent } from './terminal-pos-papper-roll.component';

describe('TerminalPosPapperRollComponent', () => {
  let component: TerminalPosPapperRollComponent;
  let fixture: ComponentFixture<TerminalPosPapperRollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalPosPapperRollComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalPosPapperRollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
