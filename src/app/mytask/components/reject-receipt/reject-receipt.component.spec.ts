import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectReceiptComponent } from './reject-receipt.component';

describe('RejectReceiptComponent', () => {
  let component: RejectReceiptComponent;
  let fixture: ComponentFixture<RejectReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectReceiptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
