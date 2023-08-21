import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestTabComponent } from './service-request-tab.component';

describe('ServiceRequestTabComponent', () => {
  let component: ServiceRequestTabComponent;
  let fixture: ComponentFixture<ServiceRequestTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceRequestTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceRequestTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
