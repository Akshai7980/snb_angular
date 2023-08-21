import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PvnReceiptComponent } from './pvn-receipt.component';

describe('PvnReceiptComponent', () => {
  let component: PvnReceiptComponent;
  let fixture: ComponentFixture<PvnReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PvnReceiptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PvnReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
