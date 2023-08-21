import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingFacilityComponent } from './funding-facility.component';

describe('FundingFacilityComponent', () => {
  let component: FundingFacilityComponent;
  let fixture: ComponentFixture<FundingFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundingFacilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundingFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
