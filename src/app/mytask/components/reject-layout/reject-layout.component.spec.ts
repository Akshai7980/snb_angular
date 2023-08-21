import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectLayoutComponent } from './reject-layout.component';

describe('RejectLayoutComponent', () => {
  let component: RejectLayoutComponent;
  let fixture: ComponentFixture<RejectLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
