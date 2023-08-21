import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiMenuComponent } from './si-menu.component';

describe('SiMenuComponent', () => {
  let component: SiMenuComponent;
  let fixture: ComponentFixture<SiMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
