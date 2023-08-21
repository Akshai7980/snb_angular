import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceFilterSadadBillerComponent } from './advance-filter-sadad-biller.component';

describe('AdvanceFilterSadadBillerComponent', () => {
  let component: AdvanceFilterSadadBillerComponent;
  let fixture: ComponentFixture<AdvanceFilterSadadBillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceFilterSadadBillerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceFilterSadadBillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
