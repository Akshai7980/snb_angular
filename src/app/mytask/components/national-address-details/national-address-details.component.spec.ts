import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalAddressDetailsComponent } from './national-address-details.component';

describe('NationalAddressDetailsComponent', () => {
  let component: NationalAddressDetailsComponent;
  let fixture: ComponentFixture<NationalAddressDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalAddressDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationalAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
