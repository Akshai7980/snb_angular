import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitLookupComponent } from './debit-lookup.component';

describe('DebitLookupComponent', () => {
  let component: DebitLookupComponent;
  let fixture: ComponentFixture<DebitLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
