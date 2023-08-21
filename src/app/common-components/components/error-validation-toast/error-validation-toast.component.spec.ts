import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorValidationToastComponent } from './error-validation-toast.component';

describe('ErrorValidationToastComponent', () => {
  let component: ErrorValidationToastComponent;
  let fixture: ComponentFixture<ErrorValidationToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorValidationToastComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorValidationToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
