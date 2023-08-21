import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntantTransferDeregisterDetailsComponent } from './intant-transfer-deregister-details.component';

describe('IntantTransferDeregisterDetailsComponent', () => {
  let component: IntantTransferDeregisterDetailsComponent;
  let fixture: ComponentFixture<IntantTransferDeregisterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntantTransferDeregisterDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntantTransferDeregisterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
