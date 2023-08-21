import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadMoiRefundReqDetailsLayoutComponent } from './sadad-moi-refund-req-details-layout.component';

describe('SadadMoiRefundReqDetailsLayoutComponent', () => {
  let component: SadadMoiRefundReqDetailsLayoutComponent;
  let fixture: ComponentFixture<SadadMoiRefundReqDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadMoiRefundReqDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadMoiRefundReqDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
