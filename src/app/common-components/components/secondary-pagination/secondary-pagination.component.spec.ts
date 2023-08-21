import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryPaginationComponent } from './secondary-pagination.component';

describe('SecondaryPaginationComponent', () => {
  let component: SecondaryPaginationComponent;
  let fixture: ComponentFixture<SecondaryPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondaryPaginationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
