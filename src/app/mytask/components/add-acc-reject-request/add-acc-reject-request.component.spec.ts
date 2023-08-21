import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccRejectRequestComponent } from './add-acc-reject-request.component';

describe('AddAccRejectRequestComponent', () => {
  let component: AddAccRejectRequestComponent;
  let fixture: ComponentFixture<AddAccRejectRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAccRejectRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAccRejectRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
