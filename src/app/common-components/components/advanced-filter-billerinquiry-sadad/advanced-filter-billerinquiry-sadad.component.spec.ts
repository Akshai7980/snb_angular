import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterBillerinquirySadadComponent } from './advanced-filter-billerinquiry-sadad.component';

describe('AdvancedFilterBillerinquirySadadComponent', () => {
  let component: AdvancedFilterBillerinquirySadadComponent;
  let fixture: ComponentFixture<AdvancedFilterBillerinquirySadadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterBillerinquirySadadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterBillerinquirySadadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
