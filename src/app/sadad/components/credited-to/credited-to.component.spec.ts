import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditedToComponent } from './credited-to.component';

describe('CreditedToComponent', () => {
  let component: CreditedToComponent;
  let fixture: ComponentFixture<CreditedToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditedToComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditedToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
