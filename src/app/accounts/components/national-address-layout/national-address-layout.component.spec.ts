import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalAddressLayoutComponent } from './national-address-layout.component';

describe('NationalAddressLayoutComponent', () => {
  let component: NationalAddressLayoutComponent;
  let fixture: ComponentFixture<NationalAddressLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalAddressLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationalAddressLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
