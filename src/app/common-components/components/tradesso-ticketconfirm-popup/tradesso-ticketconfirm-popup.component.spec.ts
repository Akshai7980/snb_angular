import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradessoTicketconfirmPopupComponent } from './tradesso-ticketconfirm-popup.component';

describe('TradessoTicketconfirmPopupComponent', () => {
  let component: TradessoTicketconfirmPopupComponent;
  let fixture: ComponentFixture<TradessoTicketconfirmPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradessoTicketconfirmPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradessoTicketconfirmPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
