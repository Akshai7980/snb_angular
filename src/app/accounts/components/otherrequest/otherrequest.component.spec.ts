import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherrequestComponent } from './otherrequest.component';

describe('OtherrequestComponent', () => {
  let component: OtherrequestComponent;
  let fixture: ComponentFixture<OtherrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherrequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
