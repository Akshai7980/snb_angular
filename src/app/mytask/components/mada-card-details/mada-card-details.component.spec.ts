import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadaCardDetailsComponent } from './mada-card-details.component';

describe('MadaCardDetailsComponent', () => {
  let component: MadaCardDetailsComponent;
  let fixture: ComponentFixture<MadaCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadaCardDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MadaCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
