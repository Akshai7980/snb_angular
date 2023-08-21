import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateRecordDetailsComponent } from './duplicate-record-details.component';

describe('DuplicateRecordDetailsComponent', () => {
  let component: DuplicateRecordDetailsComponent;
  let fixture: ComponentFixture<DuplicateRecordDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuplicateRecordDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuplicateRecordDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
