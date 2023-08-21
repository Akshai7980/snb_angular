import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandingInstructionsComponent } from './standing-instructions.component';

describe('StandingInstructionsComponent', () => {
  let component: StandingInstructionsComponent;
  let fixture: ComponentFixture<StandingInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandingInstructionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandingInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
