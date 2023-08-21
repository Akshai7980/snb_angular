import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintstypeComponent } from './complaintstype.component';

describe('ComplaintstypeComponent', () => {
  let component: ComplaintstypeComponent;
  let fixture: ComponentFixture<ComplaintstypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintstypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintstypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
