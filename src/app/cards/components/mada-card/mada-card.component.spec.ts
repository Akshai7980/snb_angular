import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadaCardComponent } from './mada-card.component';

describe('MadaCardComponent', () => {
  let component: MadaCardComponent;
  let fixture: ComponentFixture<MadaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadaCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MadaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
