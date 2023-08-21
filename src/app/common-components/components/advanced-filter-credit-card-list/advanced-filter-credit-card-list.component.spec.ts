import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterCreditCardListComponent } from './advanced-filter-credit-card-list.component';

describe('AdvancedFilterCreditCardListComponent', () => {
  let component: AdvancedFilterCreditCardListComponent;
  let fixture: ComponentFixture<AdvancedFilterCreditCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterCreditCardListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterCreditCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
