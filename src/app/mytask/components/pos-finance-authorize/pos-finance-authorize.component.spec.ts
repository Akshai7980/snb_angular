import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosFinanceAuthorizeComponent } from './pos-finance-authorize.component';

describe('PosFinanceAuthorizeComponent', () => {
  let component: PosFinanceAuthorizeComponent;
  let fixture: ComponentFixture<PosFinanceAuthorizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosFinanceAuthorizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosFinanceAuthorizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
