import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadaCardSummaryComponent } from './mada-card-summary.component';

describe('MadaCardSummaryComponent', () => {
  let component: MadaCardSummaryComponent;
  let fixture: ComponentFixture<MadaCardSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadaCardSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MadaCardSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
