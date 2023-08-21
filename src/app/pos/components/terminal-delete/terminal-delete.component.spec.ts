import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalDeleteComponent } from './terminal-delete.component';

describe('TerminalDeleteComponent', () => {
  let component: TerminalDeleteComponent;
  let fixture: ComponentFixture<TerminalDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
