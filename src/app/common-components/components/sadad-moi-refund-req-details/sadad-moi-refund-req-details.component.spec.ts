import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadMoiRefundReqDetailsComponent } from './sadad-moi-refund-req-details.component';

describe('SadadMoiRefundReqDetailsComponent', () => {
  let component: SadadMoiRefundReqDetailsComponent;
  let fixture: ComponentFixture<SadadMoiRefundReqDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadMoiRefundReqDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadMoiRefundReqDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
