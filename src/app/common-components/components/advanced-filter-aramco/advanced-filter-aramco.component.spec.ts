import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterAramcoComponent } from './advanced-filter-aramco.component';

describe('AdvancedFilterAramcoComponent', () => {
  let component: AdvancedFilterAramcoComponent;
  let fixture: ComponentFixture<AdvancedFilterAramcoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterAramcoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterAramcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
