import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadMoiRefundComponent } from './sadad-moi-refund.component';

describe('SadadMoiRefundComponent', () => {
  let component: SadadMoiRefundComponent;
  let fixture: ComponentFixture<SadadMoiRefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadMoiRefundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadMoiRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
