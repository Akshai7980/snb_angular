import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AramcoDetailsLayoutComponent } from './aramco-details-layout.component';

describe('AramcoDetailsLayoutComponent', () => {
  let component: AramcoDetailsLayoutComponent;
  let fixture: ComponentFixture<AramcoDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AramcoDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AramcoDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
