import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTransferDetailComponent } from './single-transfer-detail.component';

describe('SingleTransferDetailComponent', () => {
  let component: SingleTransferDetailComponent;
  let fixture: ComponentFixture<SingleTransferDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleTransferDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTransferDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
