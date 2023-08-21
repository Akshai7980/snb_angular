import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferinqurirydetailsComponent } from './transferinqurirydetails.component';

describe('TransferinqurirydetailsComponent', () => {
  let component: TransferinqurirydetailsComponent;
  let fixture: ComponentFixture<TransferinqurirydetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferinqurirydetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferinqurirydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
