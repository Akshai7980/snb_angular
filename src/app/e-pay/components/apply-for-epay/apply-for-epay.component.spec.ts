import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyForEpayComponent } from './apply-for-epay.component';

describe('ApplyForEpayComponent', () => {
  let component: ApplyForEpayComponent;
  let fixture: ComponentFixture<ApplyForEpayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyForEpayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyForEpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
