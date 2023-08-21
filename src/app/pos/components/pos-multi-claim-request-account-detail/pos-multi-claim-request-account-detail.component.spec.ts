import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosMultiClaimRequestAccountDetailComponent } from './pos-multi-claim-request-account-detail.component';

describe('PosMultiClaimRequestAccountDetailComponent', () => {
  let component: PosMultiClaimRequestAccountDetailComponent;
  let fixture: ComponentFixture<PosMultiClaimRequestAccountDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosMultiClaimRequestAccountDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosMultiClaimRequestAccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
