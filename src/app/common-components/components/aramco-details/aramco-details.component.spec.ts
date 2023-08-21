import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AramcoDetailsComponent } from './aramco-details.component';

describe('AramcoDetailsComponent', () => {
  let component: AramcoDetailsComponent;
  let fixture: ComponentFixture<AramcoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AramcoDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AramcoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
