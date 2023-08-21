import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtRejectLgComponent } from './et-reject-lg.component';

describe('EtRejectLgComponent', () => {
  let component: EtRejectLgComponent;
  let fixture: ComponentFixture<EtRejectLgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtRejectLgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtRejectLgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
