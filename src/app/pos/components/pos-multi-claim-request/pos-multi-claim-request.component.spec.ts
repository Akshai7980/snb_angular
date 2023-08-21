import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosMultiClaimRequestComponent } from './pos-multi-claim-request.component';

describe('PosMultiClaimRequestComponent', () => {
  let component: PosMultiClaimRequestComponent;
  let fixture: ComponentFixture<PosMultiClaimRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosMultiClaimRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosMultiClaimRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
