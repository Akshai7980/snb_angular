import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiInternationalTransferComponent } from './si-international-transfer.component';

describe('SiInternationalTransferComponent', () => {
  let component: SiInternationalTransferComponent;
  let fixture: ComponentFixture<SiInternationalTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiInternationalTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiInternationalTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
