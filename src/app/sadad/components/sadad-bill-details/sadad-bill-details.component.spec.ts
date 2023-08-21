import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadBillDetailsComponent } from './sadad-bill-details.component';

describe('SadadBillDetailsComponent', () => {
  let component: SadadBillDetailsComponent;
  let fixture: ComponentFixture<SadadBillDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadBillDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadBillDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
