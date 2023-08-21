import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalManagementAddComponent } from './terminal-management-add.component';

describe('TerminalManagementAddComponent', () => {
  let component: TerminalManagementAddComponent;
  let fixture: ComponentFixture<TerminalManagementAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalManagementAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalManagementAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
