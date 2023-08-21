import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtApplicantDetailsComponent } from './et-applicant-details.component';

describe('EtApplicantDetailsComponent', () => {
  let component: EtApplicantDetailsComponent;
  let fixture: ComponentFixture<EtApplicantDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtApplicantDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtApplicantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
