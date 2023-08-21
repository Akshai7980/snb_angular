import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantTransferRegistrationDetailsComponent } from './instant-transfer-registration-details.component';

describe('InstantTransferRegistrationDetailsComponent', () => {
  let component: InstantTransferRegistrationDetailsComponent;
  let fixture: ComponentFixture<InstantTransferRegistrationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantTransferRegistrationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstantTransferRegistrationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
