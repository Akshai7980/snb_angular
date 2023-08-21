import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjaxLoaderSmallComponent } from './ajax-loader-small.component';

describe('AjaxLoaderSmallComponent', () => {
  let component: AjaxLoaderSmallComponent;
  let fixture: ComponentFixture<AjaxLoaderSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjaxLoaderSmallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjaxLoaderSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
