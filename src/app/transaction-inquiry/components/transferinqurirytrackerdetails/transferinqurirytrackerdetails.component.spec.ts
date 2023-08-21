import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferinqurirytrackerdetailsComponent } from './transferinqurirytrackerdetails.component';

describe('TransferinqurirytrackerdetailsComponent', () => {
  let component: TransferinqurirytrackerdetailsComponent;
  let fixture: ComponentFixture<TransferinqurirytrackerdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferinqurirytrackerdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferinqurirytrackerdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
