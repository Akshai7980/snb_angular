import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantTransferDeregDetailsLayoutComponent } from './instant-transfer-dereg-details-layout.component';

describe('InstantTransferDeregDetailsLayoutComponent', () => {
  let component: InstantTransferDeregDetailsLayoutComponent;
  let fixture: ComponentFixture<InstantTransferDeregDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantTransferDeregDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstantTransferDeregDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
