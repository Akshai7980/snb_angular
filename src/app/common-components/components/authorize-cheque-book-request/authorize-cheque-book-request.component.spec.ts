import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeChequeBookRequestComponent } from './authorize-cheque-book-request.component';

describe('AuthorizeChequeBookRequestComponent', () => {
  let component: AuthorizeChequeBookRequestComponent;
  let fixture: ComponentFixture<AuthorizeChequeBookRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeChequeBookRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeChequeBookRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
