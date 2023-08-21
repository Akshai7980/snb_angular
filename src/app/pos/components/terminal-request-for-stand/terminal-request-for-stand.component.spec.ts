import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalRequestForStandComponent } from './terminal-request-for-stand.component';

describe('TerminalRequestForStandComponent', () => {
  let component: TerminalRequestForStandComponent;
  let fixture: ComponentFixture<TerminalRequestForStandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalRequestForStandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalRequestForStandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
