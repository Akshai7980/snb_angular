import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPayRequestComponent } from './e-pay-request.component';

describe('EPayRequestComponent', () => {
  let component: EPayRequestComponent;
  let fixture: ComponentFixture<EPayRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPayRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EPayRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
