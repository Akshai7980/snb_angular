import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectSingleTransferComponent } from './reject-single-transfer.component';

describe('RejectSingleTransferComponent', () => {
  let component: RejectSingleTransferComponent;
  let fixture: ComponentFixture<RejectSingleTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectSingleTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectSingleTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
