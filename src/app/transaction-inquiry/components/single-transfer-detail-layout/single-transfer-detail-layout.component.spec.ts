import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTransferDetailLayoutComponent } from './single-transfer-detail-layout.component';

describe('SingleTransferDetailLayoutComponent', () => {
  let component: SingleTransferDetailLayoutComponent;
  let fixture: ComponentFixture<SingleTransferDetailLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleTransferDetailLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTransferDetailLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
