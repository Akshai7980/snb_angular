import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantTransferRegistrationDetailsLayoutComponent } from './instant-transfer-registration-details-layout.component';

describe('InstantTransferRegistrationDetailsLayoutComponent', () => {
  let component: InstantTransferRegistrationDetailsLayoutComponent;
  let fixture: ComponentFixture<InstantTransferRegistrationDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantTransferRegistrationDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstantTransferRegistrationDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
