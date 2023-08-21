import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiOwnTransferComponent } from './si-own-transfer.component';

describe('SiOwnTransferComponent', () => {
  let component: SiOwnTransferComponent;
  let fixture: ComponentFixture<SiOwnTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiOwnTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiOwnTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
