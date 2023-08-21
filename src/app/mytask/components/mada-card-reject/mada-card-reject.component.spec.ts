import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadaCardRejectComponent } from './mada-card-reject.component';

describe('MadaCardRejectComponent', () => {
  let component: MadaCardRejectComponent;
  let fixture: ComponentFixture<MadaCardRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadaCardRejectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MadaCardRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
