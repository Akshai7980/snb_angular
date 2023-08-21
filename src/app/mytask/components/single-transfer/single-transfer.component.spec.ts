import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTransferComponent } from './single-transfer.component';

describe('SingleTransferComponent', () => {
  let component: SingleTransferComponent;
  let fixture: ComponentFixture<SingleTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
