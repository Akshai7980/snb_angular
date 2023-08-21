import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMadaCardComponent } from './add-mada-card.component';

describe('AddMadaCardComponent', () => {
  let component: AddMadaCardComponent;
  let fixture: ComponentFixture<AddMadaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMadaCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMadaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
