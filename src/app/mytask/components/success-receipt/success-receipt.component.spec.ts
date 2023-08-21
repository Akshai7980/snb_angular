import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessReceiptComponent } from './success-receipt.component';

describe('SuccessReceiptComponent', () => {
  let component: SuccessReceiptComponent;
  let fixture: ComponentFixture<SuccessReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessReceiptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
