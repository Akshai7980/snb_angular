import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadMoiDetailsComponent } from './sadad-moi-details.component';

describe('SadadMoiDetailsComponent', () => {
  let component: SadadMoiDetailsComponent;
  let fixture: ComponentFixture<SadadMoiDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadMoiDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadMoiDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
