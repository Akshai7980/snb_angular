import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccAuthorizeRequestComponent } from './add-acc-authorize-request.component';

describe('AddAccAuthorizeRequestComponent', () => {
  let component: AddAccAuthorizeRequestComponent;
  let fixture: ComponentFixture<AddAccAuthorizeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAccAuthorizeRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAccAuthorizeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
