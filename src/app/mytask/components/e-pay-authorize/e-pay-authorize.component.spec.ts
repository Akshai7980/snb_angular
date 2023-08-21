import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPayAuthorizeComponent } from './e-pay-authorize.component';

describe('EPayAuthorizeComponent', () => {
  let component: EPayAuthorizeComponent;
  let fixture: ComponentFixture<EPayAuthorizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPayAuthorizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EPayAuthorizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
