import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterMadaCardListComponent } from './advanced-filter-mada-card-list.component';

describe('AdvancedFilterMadaCardListComponent', () => {
  let component: AdvancedFilterMadaCardListComponent;
  let fixture: ComponentFixture<AdvancedFilterMadaCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterMadaCardListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterMadaCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
