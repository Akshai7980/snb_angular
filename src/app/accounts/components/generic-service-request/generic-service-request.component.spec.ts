import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericServiceRequestComponent } from './generic-service-request.component';

describe('GenericServiceRequestComponent', () => {
  let component: GenericServiceRequestComponent;
  let fixture: ComponentFixture<GenericServiceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericServiceRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericServiceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
