import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadBillersComponent } from './sadad-billers.component';

describe('SadadBillersComponent', () => {
  let component: SadadBillersComponent;
  let fixture: ComponentFixture<SadadBillersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadBillersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadBillersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
