import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosServiceRequestComponent } from './pos-service-request.component';

describe('PosServiceRequestComponent', () => {
  let component: PosServiceRequestComponent;
  let fixture: ComponentFixture<PosServiceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosServiceRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosServiceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
