import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QtlDetailsLayoutComponent } from './qtl-details-layout.component';

describe('QtlDetailsLayoutComponent', () => {
  let component: QtlDetailsLayoutComponent;
  let fixture: ComponentFixture<QtlDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QtlDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QtlDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
