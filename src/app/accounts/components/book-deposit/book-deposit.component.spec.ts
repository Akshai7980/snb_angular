import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDepositComponent } from './book-deposit.component';

describe('BookDepositComponent', () => {
  let component: BookDepositComponent;
  let fixture: ComponentFixture<BookDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookDepositComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
