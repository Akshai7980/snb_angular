import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddESALPayerComponent } from './add-esal-payer.component';

describe('AddESALPayerComponent', () => {
  let component: AddESALPayerComponent;
  let fixture: ComponentFixture<AddESALPayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddESALPayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddESALPayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
