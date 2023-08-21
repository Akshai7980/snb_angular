import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadBillersDetailsComponent } from './sadad-billers-details.component';

describe('SadadBillersDetailsComponent', () => {
  let component: SadadBillersDetailsComponent;
  let fixture: ComponentFixture<SadadBillersDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadBillersDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadBillersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
