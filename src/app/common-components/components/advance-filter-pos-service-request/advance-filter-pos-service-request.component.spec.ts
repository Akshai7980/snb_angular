import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceFilterPosServiceRequestComponent } from './advance-filter-pos-service-request.component';

describe('AdvanceFilterPosServiceRequestComponent', () => {
  let component: AdvanceFilterPosServiceRequestComponent;
  let fixture: ComponentFixture<AdvanceFilterPosServiceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceFilterPosServiceRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceFilterPosServiceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
