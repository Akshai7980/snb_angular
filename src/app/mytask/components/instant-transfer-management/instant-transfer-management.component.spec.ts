import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantTransferManagementComponent } from './instant-transfer-management.component';

describe('InstantTransferManagementComponent', () => {
  let component: InstantTransferManagementComponent;
  let fixture: ComponentFixture<InstantTransferManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantTransferManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstantTransferManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
