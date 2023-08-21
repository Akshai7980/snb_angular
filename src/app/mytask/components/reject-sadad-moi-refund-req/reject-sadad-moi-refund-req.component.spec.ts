import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectSadadMoiRefundReqComponent } from './reject-sadad-moi-refund-req.component';

describe('RejectSadadMoiRefundReqComponent', () => {
  let component: RejectSadadMoiRefundReqComponent;
  let fixture: ComponentFixture<RejectSadadMoiRefundReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectSadadMoiRefundReqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectSadadMoiRefundReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
