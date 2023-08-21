import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSadadBillerComponent } from './add-sadad-biller.component';

describe('AddSadadBillerComponent', () => {
  let component: AddSadadBillerComponent;
  let fixture: ComponentFixture<AddSadadBillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSadadBillerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSadadBillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
