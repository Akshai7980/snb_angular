import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadMoiDetailsLayoutComponent } from './sadad-moi-details-layout.component';

describe('SadadMoiDetailsLayoutComponent', () => {
  let component: SadadMoiDetailsLayoutComponent;
  let fixture: ComponentFixture<SadadMoiDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadMoiDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadMoiDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
