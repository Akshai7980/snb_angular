import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEstatementComponent } from './view-estatement.component';

describe('ViewEstatementComponent', () => {
  let component: ViewEstatementComponent;
  let fixture: ComponentFixture<ViewEstatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEstatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEstatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
