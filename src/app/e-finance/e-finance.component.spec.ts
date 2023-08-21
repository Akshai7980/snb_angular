import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EFinanceComponent } from './e-finance.component';

describe('EFinanceComponent', () => {
  let component: EFinanceComponent;
  let fixture: ComponentFixture<EFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EFinanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
