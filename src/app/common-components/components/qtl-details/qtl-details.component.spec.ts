import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QtlDetailsComponent } from './qtl-details.component';

describe('QtlDetailsComponent', () => {
  let component: QtlDetailsComponent;
  let fixture: ComponentFixture<QtlDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QtlDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QtlDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
