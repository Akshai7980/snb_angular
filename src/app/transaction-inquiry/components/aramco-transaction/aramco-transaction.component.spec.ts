import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AramcoTransactionComponent } from './aramco-transaction.component';

describe('AramcoTransactionComponent', () => {
  let component: AramcoTransactionComponent;
  let fixture: ComponentFixture<AramcoTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AramcoTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AramcoTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
