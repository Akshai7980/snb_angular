import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTransferDetailsComponent } from './single-transfer-details.component';

describe('SingleTransferDetailsComponent', () => {
  let component: SingleTransferDetailsComponent;
  let fixture: ComponentFixture<SingleTransferDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleTransferDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTransferDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
