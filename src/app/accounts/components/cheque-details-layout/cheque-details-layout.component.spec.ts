import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeDetailsLayoutComponent } from './cheque-details-layout.component';

describe('ChequeDetailsLayoutComponent', () => {
  let component: ChequeDetailsLayoutComponent;
  let fixture: ComponentFixture<ChequeDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequeDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
