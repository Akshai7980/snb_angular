import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillerManagementComponent } from './biller-management.component';

describe('BillerManagementComponent', () => {
  let component: BillerManagementComponent;
  let fixture: ComponentFixture<BillerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillerManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
