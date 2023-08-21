import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AramcoAmountDetailsComponent } from './aramco-amount-details.component';

describe('AramcoAmountDetailsComponent', () => {
  let component: AramcoAmountDetailsComponent;
  let fixture: ComponentFixture<AramcoAmountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AramcoAmountDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AramcoAmountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
