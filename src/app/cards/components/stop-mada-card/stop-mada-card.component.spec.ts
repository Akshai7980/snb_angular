import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopMadaCardComponent } from './stop-mada-card.component';

describe('StopMadaCardComponent', () => {
  let component: StopMadaCardComponent;
  let fixture: ComponentFixture<StopMadaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StopMadaCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopMadaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
