import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiLocalTransferComponent } from './si-local-transfer.component';

describe('SiLocalTransferComponent', () => {
  let component: SiLocalTransferComponent;
  let fixture: ComponentFixture<SiLocalTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiLocalTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiLocalTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
