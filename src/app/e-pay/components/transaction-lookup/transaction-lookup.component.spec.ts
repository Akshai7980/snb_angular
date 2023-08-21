import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionLookupComponent } from './transaction-lookup.component';

describe('TransactionLookupComponent', () => {
  let component: TransactionLookupComponent;
  let fixture: ComponentFixture<TransactionLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
