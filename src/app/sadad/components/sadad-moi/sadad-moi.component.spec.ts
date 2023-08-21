import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadMoiComponent } from './sadad-moi.component';

describe('SadadMoiComponent', () => {
  let component: SadadMoiComponent;
  let fixture: ComponentFixture<SadadMoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadMoiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadMoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
