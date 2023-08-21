import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateNationalAddressComponent } from './update-national-address.component';

describe('UpdateNationalAddressComponent', () => {
  let component: UpdateNationalAddressComponent;
  let fixture: ComponentFixture<UpdateNationalAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateNationalAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateNationalAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
