import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadaCardDetailsSectionComponent } from './mada-card-details-section.component';

describe('MadaCardDetailsSectionComponent', () => {
  let component: MadaCardDetailsSectionComponent;
  let fixture: ComponentFixture<MadaCardDetailsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadaCardDetailsSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MadaCardDetailsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
