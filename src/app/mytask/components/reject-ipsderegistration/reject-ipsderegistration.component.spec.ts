import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectIPSDeregistrationComponent } from './reject-ipsderegistration.component';

describe('RejectIPSDeregistrationComponent', () => {
  let component: RejectIPSDeregistrationComponent;
  let fixture: ComponentFixture<RejectIPSDeregistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectIPSDeregistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectIPSDeregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
