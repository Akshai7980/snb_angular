import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AramcoAmountDetailsCashComponent } from './aramco-amount-details-cash.component';

describe('AramcoAmountDetailsCashComponent', () => {
  let component: AramcoAmountDetailsCashComponent;
  let fixture: ComponentFixture<AramcoAmountDetailsCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AramcoAmountDetailsCashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AramcoAmountDetailsCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
