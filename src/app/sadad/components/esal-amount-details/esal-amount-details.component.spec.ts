import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsalAmountDetailsComponent } from './esal-amount-details.component';

describe('EsalAmountDetailsComponent', () => {
  let component: EsalAmountDetailsComponent;
  let fixture: ComponentFixture<EsalAmountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsalAmountDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsalAmountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
