import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadBillersDetailsLayoutComponent } from './sadad-billers-details-layout.component';

describe('SadadBillersDetailsLayoutComponent', () => {
  let component: SadadBillersDetailsLayoutComponent;
  let fixture: ComponentFixture<SadadBillersDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadBillersDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadBillersDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
