import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectChequeBookRequestComponent } from './reject-cheque-book-request.component';

describe('RejectChequeBookRequestComponent', () => {
  let component: RejectChequeBookRequestComponent;
  let fixture: ComponentFixture<RejectChequeBookRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectChequeBookRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectChequeBookRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
