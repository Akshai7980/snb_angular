import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeCommonServicesComponent } from './authorize-common-services.component';

describe('AuthorizeCommonServicesComponent', () => {
  let component: AuthorizeCommonServicesComponent;
  let fixture: ComponentFixture<AuthorizeCommonServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeCommonServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeCommonServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
