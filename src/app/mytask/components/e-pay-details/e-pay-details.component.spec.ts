import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPayDetailsComponent } from './e-pay-details.component';

describe('EPayDetailsComponent', () => {
  let component: EPayDetailsComponent;
  let fixture: ComponentFixture<EPayDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPayDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EPayDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
