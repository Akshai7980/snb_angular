import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTransferMenuComponent } from './fund-transfer-menu.component';

describe('FundTransferMenuComponent', () => {
  let component: FundTransferMenuComponent;
  let fixture: ComponentFixture<FundTransferMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundTransferMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundTransferMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
