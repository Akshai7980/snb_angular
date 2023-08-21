import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceCertificationComponent } from './balance-certification.component';

describe('BalanceCertificationComponent', () => {
  let component: BalanceCertificationComponent;
  let fixture: ComponentFixture<BalanceCertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceCertificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
