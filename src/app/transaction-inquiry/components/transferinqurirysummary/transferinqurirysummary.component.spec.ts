import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferinqurirysummaryComponent } from './transferinqurirysummary.component';

describe('TransferinqurirysummaryComponent', () => {
  let component: TransferinqurirysummaryComponent;
  let fixture: ComponentFixture<TransferinqurirysummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferinqurirysummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferinqurirysummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
