import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterSingleTransferComponent } from './advanced-filter-single-transfer.component';

describe('AdvancedFilterSingleTransferComponent', () => {
  let component: AdvancedFilterSingleTransferComponent;
  let fixture: ComponentFixture<AdvancedFilterSingleTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterSingleTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterSingleTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
