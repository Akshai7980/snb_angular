import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCrExpiryComponent } from './update-cr-expiry.component';

describe('UpdateCrExpiryComponent', () => {
  let component: UpdateCrExpiryComponent;
  let fixture: ComponentFixture<UpdateCrExpiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCrExpiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCrExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
