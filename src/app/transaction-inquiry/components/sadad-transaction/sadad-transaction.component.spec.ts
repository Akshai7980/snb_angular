import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadTransactionComponent } from './sadad-transaction.component';

describe('SadadTransactionComponent', () => {
  let component: SadadTransactionComponent;
  let fixture: ComponentFixture<SadadTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
