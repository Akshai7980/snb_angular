import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ESALPayerDetailsComponent } from './esal-payer-details.component';

describe('ESALPayerDetailsComponent', () => {
  let component: ESALPayerDetailsComponent;
  let fixture: ComponentFixture<ESALPayerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ESALPayerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ESALPayerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
