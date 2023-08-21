import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeSadadMoiRefundReqComponent } from './authorize-sadad-moi-refund-req.component';

describe('AuthorizeSadadMoiRefundReqComponent', () => {
  let component: AuthorizeSadadMoiRefundReqComponent;
  let fixture: ComponentFixture<AuthorizeSadadMoiRefundReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeSadadMoiRefundReqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeSadadMoiRefundReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
